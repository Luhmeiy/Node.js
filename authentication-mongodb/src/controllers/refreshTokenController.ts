import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import { DecodedUser } from "@/interfaces/DecodedUser";
import User from "@/model/User";

const handleRefreshToken = async (req: Request, res: Response) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) {
		res.sendStatus(401);
		return;
	}

	const refreshToken = cookies.jwt as string;

	res.clearCookie("jwt", {
		httpOnly: true,
		sameSite: "none",
		secure: true,
	});

	const foundUser = await User.findOne({ refreshToken }).exec();

	if (!foundUser) {
		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET!,
			async (error, decoded) => {
				if (error) {
					res.sendStatus(403);
					return;
				}

				const hackedUser = await User.findOne({
					username: (decoded as DecodedUser).UserInfo.username,
				}).exec();

				hackedUser!.refreshToken = [];
				await hackedUser!.save();
			}
		);

		res.sendStatus(403);
		return;
	}

	const newRefreshTokenArray = foundUser.refreshToken.filter(
		(rt) => rt !== refreshToken
	);

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET!,
		async (error, decoded) => {
			if (error) {
				foundUser.refreshToken = [...newRefreshTokenArray];
				await foundUser.save();
			}

			if (
				error ||
				foundUser.username !==
					(decoded as DecodedUser).UserInfo.username
			) {
				res.sendStatus(403);
				return;
			}

			const roles = Object.values(foundUser.roles!);

			const accessToken = jwt.sign(
				{ UserInfo: { username: foundUser.username, roles } },
				process.env.ACCESS_TOKEN_SECRET!,
				{ expiresIn: "30s" }
			);

			const newRefreshToken = jwt.sign(
				{ username: foundUser.username },
				process.env.REFRESH_TOKEN_SECRET!,
				{ expiresIn: "1d" }
			);

			foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
			await foundUser.save();

			res.cookie("jwt", newRefreshToken, {
				httpOnly: true,
				sameSite: "none",
				secure: true,
				maxAge: 24 * 60 * 60 * 1000,
			});

			res.json({ accessToken });
		}
	);
};

export const refreshTokenController = { handleRefreshToken };

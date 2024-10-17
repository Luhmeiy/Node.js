import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { Request, Response } from "express";
import User from "@/model/User";

const handleLogin = async (req: Request, res: Response) => {
	const { user, pwd } = req.body;
	const cookies = req.cookies;

	if (!user || !pwd) {
		res.status(400).json({
			message: "Username and password are required.",
		});
		return;
	}

	const foundUser = await User.findOne({ username: user }).exec();

	if (!foundUser) {
		res.sendStatus(401);
		return;
	}

	const match = await compare(pwd, foundUser.password);

	if (match) {
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

		let newRefreshTokenArray = !cookies?.jwt
			? foundUser.refreshToken
			: foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

		if (cookies?.jwt) {
			const refreshToken = cookies.jwt;
			const foundToken = await User.findOne({ refreshToken }).exec();

			if (!foundToken) {
				console.log("Attempted refresh token reuse at login.");

				newRefreshTokenArray = [];
			}

			res.clearCookie("jwt", {
				httpOnly: true,
				sameSite: "none",
				secure: true,
			});
		}

		foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
		await foundUser.save();

		res.cookie("jwt", newRefreshToken, {
			httpOnly: true,
			sameSite: "none",
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.json({ accessToken });
	} else {
		res.sendStatus(401);
	}
};

export const authController = { handleLogin };

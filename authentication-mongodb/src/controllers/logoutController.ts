import { Request, Response } from "express";
import User from "@/model/User";

const handleLogout = async (req: Request, res: Response) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) {
		res.sendStatus(401);
		return;
	}

	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken }).exec();

	if (!foundUser) {
		res.clearCookie("jwt", {
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});

		res.sendStatus(204);
		return;
	}

	foundUser.refreshToken = "";
	await foundUser.save();

	res.clearCookie("jwt", {
		httpOnly: true,
		sameSite: "none",
		secure: true,
	});

	res.sendStatus(204);
};

export const logoutController = { handleLogout };

import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import usersData from "@/model/users.json";
import { DecodedUser } from "@/interfaces/DecodedUser";
import { UsersDB } from "@/interfaces/UsersDB";

const usersDB: UsersDB = {
	users: usersData,
	setUsers: function (data) {
		this.users = data;
	},
};

const handleRefreshToken = async (req: Request, res: Response) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) {
		res.sendStatus(401);
		return;
	}

	const refreshToken = cookies.jwt as string;

	const foundUser = usersDB.users.find(
		(person) => person.refreshToken === refreshToken
	);

	if (!foundUser) {
		res.sendStatus(403);
		return;
	}

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET!,
		(error, decoded) => {
			if (
				error ||
				foundUser.username !==
					(decoded as DecodedUser).UserInfo.username
			) {
				res.sendStatus(403);
				return;
			}

			const roles = Object.values(foundUser.roles);

			const accessToken = jwt.sign(
				{ UserInfo: { username: foundUser.username, roles } },
				process.env.ACCESS_TOKEN_SECRET!,
				{ expiresIn: "30s" }
			);

			res.json({ accessToken });
		}
	);
};

export const refreshTokenController = { handleRefreshToken };

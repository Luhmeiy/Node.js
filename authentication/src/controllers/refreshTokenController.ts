import jwt from "jsonwebtoken";

import usersData from "../model/users.json";
import { UsersDB } from "../interfaces/UsersDB";

const usersDB: UsersDB = {
	users: usersData,
	setUsers: function (data) {
		this.users = data;
	},
};

const handleRefreshToken = async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;

	const foundUser = usersDB.users.find(
		(person) => person.refreshToken === refreshToken
	);

	if (!foundUser) return res.sendStatus(403);

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET!,
		(error, decoded) => {
			if (error || foundUser.username !== decoded.username) {
				return res.sendStatus(403);
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

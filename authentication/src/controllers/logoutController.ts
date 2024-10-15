import { writeFile } from "fs/promises";
import { join } from "path";

import usersData from "../model/users.json";
import { __dirname } from "../server";
import { UsersDB } from "../interfaces/UsersDB";

const usersDB: UsersDB = {
	users: usersData,
	setUsers: function (data) {
		this.users = data;
	},
};

const handleLogout = async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;

	const foundUser = usersDB.users.find(
		(person) => person.refreshToken === refreshToken
	);

	if (!foundUser) {
		res.clearCookie("jwt", {
			httpOnly: true,
			sameSite: "None",
			secure: true,
		});

		return res.sendStatus(204);
	}

	const otherUsers = usersDB.users.filter(
		(person) => person.refreshToken !== foundUser.refreshToken
	);

	const currentUser = { ...foundUser, refreshToken: "" };

	usersDB.setUsers([...otherUsers, currentUser]);

	await writeFile(
		join(__dirname, "model", "users.json"),
		JSON.stringify(usersDB.users)
	);

	res.clearCookie("jwt", {
		httpOnly: true,
		sameSite: "None",
		secure: true,
	});

	res.sendStatus(204);
};

export const logoutController = { handleLogout };

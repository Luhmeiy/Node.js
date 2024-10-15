import { Request, Response } from "express";
import { writeFile } from "fs/promises";
import { join } from "path";

import usersData from "@/model/users.json";
import { UsersDB } from "@/interfaces/UsersDB";
import { __dirname } from "@/server";

const usersDB: UsersDB = {
	users: usersData,
	setUsers: function (data) {
		this.users = data;
	},
};

const handleLogout = async (req: Request, res: Response) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) {
		res.sendStatus(401);
		return;
	}

	const refreshToken = cookies.jwt;

	const foundUser = usersDB.users.find(
		(person) => person.refreshToken === refreshToken
	);

	if (!foundUser) {
		res.clearCookie("jwt", {
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});

		res.sendStatus(204);
		return;
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
		sameSite: "none",
		secure: true,
	});

	res.sendStatus(204);
};

export const logoutController = { handleLogout };

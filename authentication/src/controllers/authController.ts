import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
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

const handleLogin = async (req: Request, res: Response) => {
	const { user, pwd } = req.body;

	if (!user || !pwd) {
		res.status(400).json({
			message: "Username and password are required.",
		});
		return;
	}

	const foundUser = usersDB.users.find((person) => person.username === user);

	if (!foundUser) {
		res.sendStatus(401);
		return;
	}

	const match = await compare(pwd, foundUser.password);

	if (match) {
		const roles = Object.values(foundUser.roles);

		const accessToken = jwt.sign(
			{ UserInfo: { username: foundUser.username, roles } },
			process.env.ACCESS_TOKEN_SECRET!,
			{ expiresIn: "30s" }
		);

		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET!,
			{ expiresIn: "1d" }
		);

		const otherUsers = usersDB.users.filter(
			(person) => person.username !== foundUser.username
		);
		const currentUser = { ...foundUser, refreshToken };

		usersDB.setUsers([...otherUsers, currentUser]);

		await writeFile(
			join(__dirname, "model", "users.json"),
			JSON.stringify(usersDB.users)
		);

		res.cookie("jwt", refreshToken, {
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

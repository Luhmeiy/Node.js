import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
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

const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;

	if (!user || !pwd) {
		return res
			.status(400)
			.json({ message: "Username and password are required." });
	}

	const foundUser = usersDB.users.find((person) => person.username === user);

	if (!foundUser) return res.sendStatus(401);

	const match = await compare(pwd, foundUser.password);

	if (match) {
		const accessToken = jwt.sign(
			{ username: foundUser.username },
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
			sameSite: "None",
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.json({ accessToken });
	} else {
		res.sendStatus(401);
	}
};

export const authController = { handleLogin };

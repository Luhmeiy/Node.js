import { hash } from "bcrypt";
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

const handleNewUser = async (req: Request, res: Response) => {
	const { user, pwd } = req.body;

	if (!user || !pwd) {
		res.status(400).json({
			message: "Username and password are required.",
		});
		return;
	}

	const duplicate = usersDB.users.find((person) => person.username === user);

	if (duplicate) {
		res.sendStatus(409);
		return;
	}

	try {
		const hashedPwd = await hash(pwd, 10);

		const newUser = {
			username: user,
			role: { User: 2001 },
			password: hashedPwd,
		};
		usersDB.setUsers([...usersDB.users, newUser]);

		await writeFile(
			join(__dirname, "model", "users.json"),
			JSON.stringify(usersDB.users)
		);

		console.log(usersDB.users);

		res.status(201).json({ success: `New user ${user} created!` });
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

export const registerController = {
	handleNewUser,
};

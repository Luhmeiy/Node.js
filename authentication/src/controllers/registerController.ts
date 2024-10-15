import { hash } from "bcrypt";
import { join } from "path";
import { writeFile } from "fs/promises";

import usersData from "../model/users.json";
import { __dirname } from "../server";
import { UsersDB } from "../interfaces/UsersDB";

const usersDB: UsersDB = {
	users: usersData,
	setUsers: function (data) {
		this.users = data;
	},
};

const handleNewUser = async (req, res) => {
	const { user, pwd } = req.body;

	if (!user || !pwd) {
		return res
			.status(400)
			.json({ message: "Username and password are required." });
	}

	const duplicate = usersDB.users.find((person) => person.username === user);

	if (duplicate) return res.sendStatus(409);

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
		res.status(500).json({ message: error.message });
	}
};

export const registerController = {
	handleNewUser,
};

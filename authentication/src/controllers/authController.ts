import { compare } from "bcrypt";
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
		res.json({ success: `User ${user} is logged in!` });
	} else {
		res.sendStatus(401);
	}
};

export const authController = { handleLogin };

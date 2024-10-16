import { hash } from "bcrypt";
import { Request, Response } from "express";
import User from "@/model/User";

const handleNewUser = async (req: Request, res: Response) => {
	const { user, pwd } = req.body;

	if (!user || !pwd) {
		res.status(400).json({
			message: "Username and password are required.",
		});
		return;
	}

	const duplicate = await User.findOne({ username: user }).exec();

	if (duplicate) {
		res.sendStatus(409);
		return;
	}

	try {
		const hashedPwd = await hash(pwd, 10);

		await User.create({
			username: user,
			password: hashedPwd,
		});

		res.status(201).json({ success: `New user ${user} created!` });
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

export const registerController = {
	handleNewUser,
};

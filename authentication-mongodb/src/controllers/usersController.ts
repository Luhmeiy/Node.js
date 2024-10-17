import { Request, Response } from "express";
import User from "@/model/User";

const getAllUsers = async ({ res }: { res: Response }) => {
	const users = await User.find();

	if (!users) {
		res.status(204).json({ message: "No users found" });
		return;
	}

	res.json(users);
};

const deleteUser = async (req: Request, res: Response) => {
	if (!req?.body?.id) {
		res.status(400).json({ message: "User ID required" });
		return;
	}

	const user = await User.findById(req.body.id).exec();

	if (!user) {
		res.status(204).json({ message: `User ID ${req.body.id} not found.` });
		return;
	}

	const result = await User.deleteOne({ _id: req.body.id });

	res.json(result);
};

const getUser = async (req: Request, res: Response) => {
	if (!req?.params?.id) {
		res.status(400).json({ message: "User ID required" });
		return;
	}

	const user = await User.findById(req.params.id).exec();

	if (!user) {
		res.status(204).json({
			message: `User ID ${req.params.id} not found.`,
		});
	}

	res.json(user);
};

export const usersController = {
	getAllUsers,
	deleteUser,
	getUser,
};

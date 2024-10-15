import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { DecodedUser } from "@/interfaces/DecodedUser";
import { Roles } from "@/interfaces/Roles";

interface CustomRequest extends Request {
	user: string;
	roles: Roles;
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
	const authHeader =
		req.headers.authorization || (req.headers.Authorization as string);

	if (!authHeader?.startsWith("Bearer ")) {
		res.sendStatus(401);
		return;
	}

	const token = authHeader.split(" ")[1];

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, decoded) => {
		if (error) {
			res.sendStatus(403);
			return;
		}

		(req as CustomRequest).user =
			(decoded as DecodedUser)!.UserInfo.username;
		(req as CustomRequest).roles = (decoded as DecodedUser)!.UserInfo.roles;
		next();
	});
};

import { NextFunction, Request, Response } from "express";
import { Roles } from "@/interfaces/Roles";

interface CustomRequest extends Request {
	roles: Roles[];
}

export const verifyRoles = (...allowedRoles: Roles[]) => {
	return (req: CustomRequest, res: Response, next: NextFunction) => {
		if (!req?.roles) {
			res.sendStatus(401);
			return;
		}

		const rolesArray = [...allowedRoles];

		const result = req.roles
			.map((role) => rolesArray.includes(role))
			.find((val) => val === true);

		if (!result) {
			res.sendStatus(401);
			return;
		}

		next();
	};
};

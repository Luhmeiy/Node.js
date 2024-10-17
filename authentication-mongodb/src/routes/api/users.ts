import { ROLES_LIST } from "@/config/roles_list";
import { usersController } from "@/controllers/usersController";
import { verifyRoles } from "@/middleware/verifyRoles";
import { Router } from "express";

export const router = Router();

router
	.route("/")
	.get(usersController.getAllUsers)
	.delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

router
	.route("/:id")
	.get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

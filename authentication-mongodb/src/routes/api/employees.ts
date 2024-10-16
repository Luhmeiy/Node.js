import { Router } from "express";
import { ROLES_LIST } from "@/config/roles_list";
import { employeesController } from "@/controllers/employeesController";
import { verifyRoles } from "@/middleware/verifyRoles";

export const router = Router();

router
	.route("/")
	.get(employeesController.getAllEmployees)
	.post(
		verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
		employeesController.createNewEmployee
	)
	.put(
		verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
		employeesController.updateEmployee
	)
	.delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

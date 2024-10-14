import { Router } from "express";
import { employeesController } from "../../controllers/employeesController";

export const router = Router();

router
	.route("/")
	.get(employeesController.getAllEmployees)
	.post(employeesController.createNewEmployee)
	.put(employeesController.updateEmployee)
	.delete(employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

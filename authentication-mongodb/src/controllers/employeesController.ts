import { Request, Response } from "express";
import Employee from "@/model/Employee";

const getAllEmployees = async ({ res }: { res: Response }) => {
	const employees = await Employee.find();

	if (!employees) {
		res.sendStatus(204).json({ message: "No employees found." });
		return;
	}

	res.json(employees);
};

const createNewEmployee = async (req: Request, res: Response) => {
	if (!req?.body?.firstname || !req?.body?.lastname) {
		res.status(400).json({ message: "First and last names are required." });
		return;
	}

	try {
		const result = await Employee.create({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
		});

		res.status(201).json(result);
	} catch (error) {
		console.log(error);
	}
};

const updateEmployee = async (req: Request, res: Response) => {
	if (!req?.body?.id) {
		res.status(400).json({ message: "Employee ID is required." });
		return;
	}

	const employee = await Employee.findById(req.body.id).exec();

	if (!employee) {
		res.status(204).json({
			message: `No employee matches ID ${req.body.id}.`,
		});
		return;
	}

	if (req.body?.firstname) employee.firstname = req.body.firstname;
	if (req.body?.lastname) employee.lastname = req.body.lastname;

	const result = await employee.save();

	res.json(result);
};

const deleteEmployee = async (req: Request, res: Response) => {
	if (!req?.body?.id) {
		res.status(400).json({ message: "Employee ID is required." });
		return;
	}

	const employee = await Employee.findById(req.body.id).exec();

	if (!employee) {
		res.status(400).json({
			message: `Employee ID ${req.body.id} not found`,
		});
		return;
	}

	const result = await Employee.deleteOne({ _id: req.body.id });

	res.json(result);
};

const getEmployee = async (req: Request, res: Response) => {
	if (!req?.params?.id) {
		res.status(400).json({ message: "Employee ID is required." });
		return;
	}

	const employee = await Employee.findById(req.params.id).exec();

	if (!employee) {
		res.status(400).json({
			message: `Employee ID ${req.params.id} not found`,
		});
		return;
	}

	res.json(employee);
};

export const employeesController = {
	getAllEmployees,
	createNewEmployee,
	updateEmployee,
	deleteEmployee,
	getEmployee,
};

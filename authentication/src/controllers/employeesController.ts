import { Request, Response } from "express";
import employeesData from "@/model/employees.json";

const data = {
	employees: employeesData,
	setEmployees: function (data: typeof employeesData) {
		this.employees = data;
	},
};

const getAllEmployees = ({ res }: { res: Response }) => {
	res.json(data.employees);
};

const createNewEmployee = (req: Request, res: Response) => {
	const newEmployee = {
		id: data.employees?.length
			? data.employees[data.employees.length - 1].id + 1
			: 1,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
	};

	if (!newEmployee.firstname || !newEmployee.lastname) {
		res.status(400).json({ message: "First and last names are required." });
		return;
	}

	data.setEmployees([...data.employees, newEmployee]);
	res.status(201).json(data.employees);
};

const updateEmployee = (req: Request, res: Response) => {
	const employee = data.employees.find(
		(emp) => emp.id === parseInt(req.body.id)
	);

	if (!employee) {
		res.status(400).json({
			message: `Employee ID ${req.body.id} not found`,
		});
		return;
	}

	if (req.body.firstname) employee.firstname = req.body.firstname;
	if (req.body.lastname) employee.lastname = req.body.lastname;

	const filteredArray = data.employees.filter(
		(emp) => emp.id !== parseInt(req.body.id)
	);

	const unsortedArray = [...filteredArray, employee];
	data.setEmployees(
		unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
	);

	res.json(data.employees);
};

const deleteEmployee = (req: Request, res: Response) => {
	const employee = data.employees.find(
		(emp) => emp.id === parseInt(req.body.id)
	);

	if (!employee) {
		res.status(400).json({
			message: `Employee ID ${req.body.id} not found`,
		});
		return;
	}

	const filteredArray = data.employees.filter(
		(emp) => emp.id !== parseInt(req.body.id)
	);

	data.setEmployees([...filteredArray]);

	res.json(data.employees);
};

const getEmployee = (req: Request, res: Response) => {
	const employee = data.employees.find(
		(emp) => emp.id === parseInt(req.params.id)
	);

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

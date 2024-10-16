import { Response } from "express";
import { logEvents } from "./logEvents";

export const errorHandler = ({ err, res }: { err: Error; res: Response }) => {
	logEvents(`${err.name}: ${err.message}`, "errLog.txt");
	console.error(err.stack);
	res.status(500).send(err.message);
};

import { format } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { existsSync, promises } from "fs";
import { join } from "path";
import { v4 as uuid } from "uuid";
import { __dirname } from "@/server";

export const logEvents = async (message: string, logName: string) => {
	const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
	const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

	try {
		if (!existsSync(join(__dirname, "..", "logs"))) {
			await promises.mkdir(join(__dirname, "..", "logs"));
		}

		await promises.appendFile(
			join(__dirname, "..", "logs", logName),
			logItem
		);
	} catch (err) {
		console.log(err);
	}
};

export const logger = (req: Request, res: Response, next: NextFunction) => {
	logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
	console.log(`${req.method} ${req.path}`);
	next();
};

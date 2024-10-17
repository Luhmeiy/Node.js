import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { corsOptions } from "./config/corsOptions";
import { connectDB } from "./config/dbConn";
import { errorHandler } from "./middleware/errorHandler";
import { credentials } from "./middleware/credentials";
import { logger } from "./middleware/logEvents";
import { router } from "./routes/router";

config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3500;

export const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", express.static(resolve(__dirname, "/public")));

app.use(router);

app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(resolve(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ error: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
	console.log("Connected to database");

	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

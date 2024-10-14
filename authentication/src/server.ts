import cors from "cors";
import express from "express";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { corsOptions } from "./config/corsOptions";
import { logger } from "./middleware/logEvents";
import errorHandler from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3500;

export const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", express.static(resolve(__dirname, "/public")));

// Routes
import { router as rootRoutes } from "./routes/root";
import { router as registerRoutes } from "./routes/register";
import { router as authRoutes } from "./routes/auth";
import { router as employeesRoutes } from "./routes/api/employees";

app.use("/", rootRoutes);
app.use("/register", registerRoutes);
app.use("/auth", authRoutes);
app.use("/employees", employeesRoutes);

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import Fastify from "fastify";
import jwt from "@fastify/jwt";
import "dotenv/config";

import { userRoutes } from "./routes/userRoutes";

const app = Fastify({
	logger: true,
});

app.register(jwt, { secret: process.env.JWT_SECRET! });

app.register(userRoutes, { prefix: "/api/users" });

app.listen({ port: 3000, host: "0.0.0.0" }, (err) => {
	if (err) throw err;
});

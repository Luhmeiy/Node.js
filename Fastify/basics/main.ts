import Fastify from "fastify";
import { userRoutes } from "./routes/userRoutes";

const app = Fastify({
	logger: true,
});

declare module "fastify" {
	export interface FastifyRequest {
		user: {
			name: string;
		};
	}
	export interface FastifyInstance {
		signJwt: () => string;
		verifyJwt: () => { name: string };
	}
}

app.decorateRequest("user", null);

app.addHook("preHandler", async (request) => {
	request.user = { name: "Bob Jones" };
});

app.decorate("signJwt", () => {
	return "Signed JWT";
});

app.decorate("verifyJwt", () => {
	return {
		name: "Tom",
	};
});

app.register(userRoutes, { prefix: "/api/users" });

async function main() {
	await app.listen({
		port: 3000,
		host: "0.0.0.0",
	});
}

main();

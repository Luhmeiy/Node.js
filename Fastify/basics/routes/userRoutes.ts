import { FastifyInstance, FastifyRequest } from "fastify";

export async function userRoutes(app: FastifyInstance) {
	app.addHook("onRequest", async () => {
		app.log.info("Got a request");
	});

	app.addHook("onResponse", async (_, reply) => {
		app.log.info(`Responding... ${reply.getResponseTime()}`);
	});

	app.get(
		"/",
		async (
			request: FastifyRequest<{
				Body: {
					name: string;
					age: number;
				};
			}>,
			reply
		) => {
			const body = request.body;

			const jwt = app.signJwt();

			app.log.info(jwt);

			const verified = app.verifyJwt();

			// return reply.code(201).send(body.name);
			// return reply.code(201).send(request.user);
			return reply.code(201).send({ jwt, verified });
		}
	);

	app.log.info("User routes registered");
}

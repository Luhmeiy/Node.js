import { FastifyInstance } from "fastify";

export async function userRoutes(app: FastifyInstance) {
	app.post("/", async (request, reply) => {
		const body = request.body;

		const token = await reply.jwtSign(
			{ body },
			{
				expiresIn: "1000",
			}
		);

		return reply.code(201).send(token);
	});

	app.get("/verify", async (request, reply) => {
		await request.jwtVerify();

		return reply.send(request.user);
	});

	app.log.info("User routes registered");
}

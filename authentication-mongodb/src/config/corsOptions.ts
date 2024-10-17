export const allowedOrigins = [
	"http://127.0.0.1:5500",
	"http://localhost:3500",
	"http://localhost:5173",
];

export const corsOptions = {
	origin: (
		origin: string | undefined,
		callback: (err: Error | null, origin?: boolean) => void
	) => {
		if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	optionsSuccessStatus: 200,
};

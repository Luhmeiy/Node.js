import { connect } from "mongoose";

export const connectDB = async () => {
	try {
		await connect(process.env.DATABASE_URI!);
	} catch (error) {
		console.log(error);
	}
};

import { model, Schema } from "mongoose";

const employeeSchema = new Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
});

export default model("Employee", employeeSchema);

import { Schema, model } from "mongoose";

const TestSchema = new Schema(
	{
		name: { type: String, required: true },
	},
	{ collection: "Tests" }
);

export default model("Test", TestSchema);

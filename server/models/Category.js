import { Schema, model } from "mongoose";

const categorySchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
	},
	{ timestamps: true, collection: "Categories" }
);

export default model("Category", categorySchema);

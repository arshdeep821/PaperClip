import { Schema, model } from "mongoose";

const ItemSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		category: {
			type: Schema.Types.ObjectId,
			ref: "Category",
			required: true,
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		condition: {
			type: String,
			enum: ["New", "Used", "Damaged"],
			required: true,
		},
		imagePath: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true, collection: "Items" }
);

export default model("Item", ItemSchema);
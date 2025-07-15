import { Schema, model } from "mongoose";

const tradeSchema = new Schema(
	{
		user1: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		user2: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		items1: [
			{
				type: Schema.Types.ObjectId,
				ref: "Item",
				required: true,
			},
		],
		items2: [
			{
				type: Schema.Types.ObjectId,
				ref: "Item",
				required: true,
			},
		],
		status: {
			type: String,
			enum: ["pending", "accepted", "rejected", "cancelled", "renegotiated"],
			default: "pending",
		},
	},
	{ timestamps: true, collection: "Trades" }
);

export default model("Trade", tradeSchema);

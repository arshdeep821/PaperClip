import { Schema, model } from "mongoose";

const tradeConfirmationSchema = new Schema({
	user1Confirmation: { type: Boolean, default: false, required: true },
	user2Confirmation: { type: Boolean, default: false, required: true },
});

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
			enum: [
				"pending",
				"accepted",
				"rejected",
				"cancelled",
				"renegotiated",
				"successful",
			],
			default: "pending",
		},
		tradeConfirmation: { type: tradeConfirmationSchema, default: null },
	},
	{ timestamps: true, collection: "Trades" }
);

export default model("Trade", tradeSchema);

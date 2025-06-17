import { Schema, model } from "mongoose";

const UserSchema = new Schema(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		location: { type: String, required: true },
		tradingRadius: { type: Number, required: true, default: 10 },
		inventory: [{ type: Schema.Types.ObjectId, ref: "Item", default: [] }],
	},
	{ timestamps: true, collection: "Users" }
);

export default model("User", UserSchema);

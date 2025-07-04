import { Schema, model } from "mongoose";

const userPreferenceSchema = new Schema({
	category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
	description: { type: String, required: true },
});

const UserSchema = new Schema(
	{
		username: { type: String, required: true, unique: true },
		name: { type: String, required: true },
		password: { type: String, required: true },
		email: { type: String, required: true },
		city: { type: String, required: true },
		country: { type: String, required: true },
		tradingRadius: { type: Number, required: true, default: 10 },
		inventory: [{ type: Schema.Types.ObjectId, ref: "Item", default: [] }],
		userPreferences: { type: [userPreferenceSchema], default: [] },
	},
	{ timestamps: true, collection: "Users" }
);

export default model("User", UserSchema);

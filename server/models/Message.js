import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { collection: "Messages"});

export default model("Message", MessageSchema);
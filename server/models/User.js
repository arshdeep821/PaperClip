const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: [] }],
}, { timestamps: true, collection: "Users" })

module.exports = mongoose.model('User', UserSchema)
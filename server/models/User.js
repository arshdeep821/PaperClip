const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true},
    tradingRadius: { type: Number, required: true, default: 10 },
    inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: [] }],
}, { timestamps: true, collection: "Users" })

module.exports = mongoose.model('User', UserSchema)
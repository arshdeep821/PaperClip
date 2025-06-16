const mongoose = require("mongoose")

const tradeSchema = new mongoose.Schema({
    user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items1: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }],
    items2: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }],
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' },
}, { timestamps: true, collection: "Trades" });

module.exports = mongoose.model('Trade', tradeSchema);
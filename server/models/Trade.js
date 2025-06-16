const mongoose = require("mongoose")

const tradeSchema = new mongoose.Schema({
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemsFrom: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }],
    itemsTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }],
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending' },
}, { timestamps: true, collection: "Trades" });

module.exports = mongoose.model('Trade', tradeSchema);
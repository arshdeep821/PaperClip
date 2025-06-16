const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
}, { timestamps: true, collection: 'Categories' });

module.exports = mongoose.model('Category', categorySchema);
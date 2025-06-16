const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true }, // e.g., 'Weapon', 'Armor', 'Potion'
  description: { type: String },
}, { timestamps: true, collection: 'Categories' });

module.exports = mongoose.model('Category', categorySchema);
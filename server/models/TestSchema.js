const mongoose = require("mongoose")

const TestSchema = new mongoose.Schema({
    name: {type: String, required: true}
}, { collection: 'Tests'})

module.exports = mongoose.model('Test', TestSchema)
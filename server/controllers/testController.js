const { StatusCodes } = require('http-status-codes');
const Test = require("../models/TestSchema");

const testController = async (req, res) => {
    const test = await Test.create({name: "Arshdeep"})
    res.status(StatusCodes.OK).json(test)
}

module.exports = {
    testController
}
const express = require("express")
const router = express.Router()

const { createItem } = require("../controllers/items")

router.route("/").post(createItem)


module.exports = router
const express = require("express")
const router = express.Router()

const { createCategory, getAllCategories } = require("../controllers/categories")

router.route("/").post(createCategory).get(getAllCategories)

module.exports = router
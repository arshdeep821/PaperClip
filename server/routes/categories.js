import { Router } from "express";
const router = Router();

import { createCategory, getAllCategories } from "../controllers/categories.js"

router.route("/").post(createCategory).get(getAllCategories);

export default router;

import { Router } from "express";
const router = Router();

const { createCategory, getAllCategories } =
	require("../controllers/categories").default.default;

router.route("/").post(createCategory).get(getAllCategories);

export default router;

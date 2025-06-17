import { Router } from "express";
const router = Router();

import { createItem } from "../controllers/items.js";

router.route("/").post(createItem);

export default router;

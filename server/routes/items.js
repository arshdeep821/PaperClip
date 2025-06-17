import { Router } from "express";
const router = Router();

import { createItem } from "../controllers/items";

router.route("/").post(createItem);

export default router;

import { Router } from "express";
const router = Router();

import { createTrade, getTradesByUserId } from "../controllers/trades.js";

router.route("/").post(createTrade);
router.route("/:id").get(getTradesByUserId);

export default router;
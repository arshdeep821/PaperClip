import { Router } from "express";
const router = Router();

import { createTrade, getTradesByUser1Id, getTradesByUser2Id } from "../controllers/trades.js";

router.route("/").post(createTrade);
router.route("/:id").get(getTradesByUser1Id);
router.route("/user2/:id").get(getTradesByUser2Id);

export default router;
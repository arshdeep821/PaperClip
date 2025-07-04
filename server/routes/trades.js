import { Router } from "express";
const router = Router();

import { createTrade, executeTrade, getTradesByUserId, updateTradeStatus } from "../controllers/trades.js";

router.route("/").post(createTrade);
router.route("/execute").patch(executeTrade);
router.route("/:userId").get(getTradesByUserId);
router.route("/:tradeId").patch(updateTradeStatus);

export default router;

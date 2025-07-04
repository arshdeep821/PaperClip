import { Router } from "express";
const router = Router();
import { createTrade, executeTrade, getTradesByUser1Id, getTradesByUser2Id, updateTradeStatus } from "../controllers/trades.js";

router.route("/").post(createTrade);
router.route("/execute").patch(executeTrade);
router.route("/:userId").get(getTradesByUserId);
router.route("/user2/:id").get(getTradesByUser2Id);
router.route("/:tradeId").patch(updateTradeStatus);

export default router;

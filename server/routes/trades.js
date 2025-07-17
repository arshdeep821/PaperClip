import { Router } from "express";
const router = Router();
import {
	createTrade,
	executeTrade,
	getTradesByUser1Id,
	getTradesByUserId,
	updateTradeStatus,
	getHistory,
	getAllPendingTrades,
} from "../controllers/trades.js";

router.route("/").post(createTrade);
router.route("/").get(getAllPendingTrades);
router.route("/execute").patch(executeTrade);
router.route("/history/:itemId").get(getHistory);
router.route("/:userId").get(getTradesByUser1Id);
router.route("/user2/:id").get(getTradesByUserId);
router.route("/:tradeId").patch(updateTradeStatus);

export default router;

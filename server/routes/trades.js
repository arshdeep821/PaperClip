import { Router } from "express";
const router = Router();

import { createTrade } from "../controllers/trades";

router.route("/").post(createTrade);

export default router;
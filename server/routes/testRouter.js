import { Router } from "express";
const router = Router();

import { testController } from "../controllers/testController";

router.route("/").get(testController);

export default router;

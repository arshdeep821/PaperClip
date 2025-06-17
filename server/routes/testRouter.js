import { Router } from "express";
const router = Router();

import { testController } from "../controllers/testController.js";

router.route("/").get(testController);

export default router;

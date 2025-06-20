import { Router } from "express";
const router = Router();

import { createUser, loginUser, getUser } from "../controllers/users.js";

router.route("/").post(createUser);
router.route("/login").post(loginUser);
router.route("/:id").get(getUser);

export default router;

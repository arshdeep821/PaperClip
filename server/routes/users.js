import { Router } from "express";
const router = Router();

import { createUser, getUser } from "../controllers/users";

router.route("/").post(createUser);
router.route("/:id").get(getUser);

export default router;

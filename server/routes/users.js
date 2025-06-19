import { Router } from "express";
import { createUser, loginUser, getUser, updateUser } from "../controllers/users.js";
const router = Router();

router.route("/").post(createUser);
router.route("/login").post(loginUser);
router.route("/:id").get(getUser);
router.route("/:id").put(updateUser);

export default router;

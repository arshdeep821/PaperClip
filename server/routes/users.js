import { Router } from "express";
import { createUser, loginUser, getUser, updateUser, validateSession } from "../controllers/users.js";
const router = Router();

router.route("/").post(createUser);
router.route("/login").post(loginUser);
router.route("/validate-session").get(validateSession);
router.route("/:id").get(getUser);
router.route("/:id").put(updateUser);

export default router;

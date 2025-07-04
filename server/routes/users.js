import { Router } from "express";
const router = Router();

import {
	createUser,
	loginUser,
	getUser,
	updateUser,
	updateUserPreferences,
	getRecommendationByUserID,
} from "../controllers/users.js";

router.route("/").post(createUser);
router.route("/login").post(loginUser);
router.route("/:id").get(getUser);
router.route("/:id").put(updateUser);
router.route("/:id/preferences").patch(updateUserPreferences);
router.route("/:id/recommend").get(getRecommendationByUserID);

export default router;

import { Router } from "express";
const router = Router();

import {
	createUser,
	loginUser,
	getUser,
	updateUser,
	updateUserPreferences,
	getRecommendationByUserID,
	deleteUser,
	updateUserPrivacy,
	updateUserPassword,
	restoreSession,
} from "../controllers/users.js";

router.route("/").post(createUser);
router.route("/session").get(restoreSession);
router.route("/login").post(loginUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
router.route("/:id/preferences").patch(updateUserPreferences);
router.route("/:id/privacy").patch(updateUserPrivacy);
router.route("/:id/recommend").get(getRecommendationByUserID);
router.route("/:id/password").patch(updateUserPassword);

export default router;

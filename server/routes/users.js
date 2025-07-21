import { Router } from "express";
import multer from "multer";
import path from "path";
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
	updateUserProfilePicture,
	checkUsernameAvailability,
	restoreSession,
} from "../controllers/users.js";

const profilePictureStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/profile-pictures");
	},
	filename: function (req, file, cb) {
		const userId = req.params.id;
		const timestamp = Date.now();
		const random = Math.round(Math.random() * 1E9);
		cb(null, `${userId}-${timestamp}-${random}${path.extname(file.originalname)}`);
	}
});

const uploadProfilePicture = multer({
	storage: profilePictureStorage,
	fileFilter: (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png|gif/;
		const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
		const mimetype = allowedTypes.test(file.mimetype);

		if (mimetype && extname) {
			return cb(null, true);
		} else {
			cb(new Error('Only image files are allowed!'));
		}
	},
	limits: {
		fileSize: 5 * 1024 * 1024
	}
});

router.route("/").post(createUser);
router.route("/session").get(restoreSession);
router.route("/login").post(loginUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
router.route("/:id/preferences").patch(updateUserPreferences);
router.route("/:id/privacy").patch(updateUserPrivacy);
router.route("/:id/recommend").get(getRecommendationByUserID);
router.route("/:id/password").patch(updateUserPassword);
router.route("/:id/profile-picture").patch(uploadProfilePicture.single("profilePicture"), updateUserProfilePicture);
router.route("/check-username/:username").get(checkUsernameAvailability);

export default router;

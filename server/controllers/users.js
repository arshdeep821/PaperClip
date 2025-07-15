import User from "../models/User.js";
import Category from "../models/Category.js";
import { StatusCodes } from "http-status-codes";
import { hash, compare } from "bcrypt";
import { getRecommendationsForUser } from "../util/recommender.js";

const DEFAULT_USER_RADIUS = 10;

const createUser = async (req, res) => {
	try {
		const {
			username,
			name,
			password,
			email,
			city,
			country,
			lat,
			lon,
			tradingRadius,
		} = req.body;

		if (
			!username ||
			!name ||
			!password ||
			!email ||
			!city ||
			!country ||
			!lat ||
			!lon
		) {
			return res.status(400).json({
				error: "Username, name, password, email, city, country, lat, and lon are required.",
			});
		}

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res
				.status(StatusCodes.CONFLICT)
				.json({ error: "Username already exists." });
		}

		const hashedPassword = await hash(
			password,
			Math.floor(Math.random() * 10) + 1 // random number between 1 and 10
		);

		const newUser = new User({
			username,
			name,
			password: hashedPassword,
			email,
			city,
			country,
			lat,
			lon,
			tradingRadius: tradingRadius || DEFAULT_USER_RADIUS,
		});

		await newUser.save();

		const userResponse = {
			_id: newUser._id,
			username: newUser.username,
			name: newUser.name,
			email: newUser.email,
			city: newUser.city,
			country: newUser.country,
			lat: newUser.lat,
			lon: newUser.lon,
			tradingRadius: newUser.tradingRadius,
			userPreferences: newUser.userPreferences,
			inventory: newUser.inventory,
			isPrivate: newUser.isPrivate,
			createdAt: newUser.createdAt,
		};

		res.status(StatusCodes.CREATED).json(userResponse);
	} catch (err) {
		console.error("Error creating user:", err);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Server error. Could not create user.",
		});
	}
};

const loginUser = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: "Username and password are required.",
			});
		}

		const user = await User.findOne({ username })
			.populate("userPreferences.category")
			.populate({
				path: "inventory",
				populate: {
					path: "category", // deep populate category inside each item
				},
			});

		if (!user) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: "Invalid username.",
			});
		}

		const isMatch = await compare(password, user.password);
		if (!isMatch) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				error: "Invalid password.",
			});
		}

		req.session.userId = user._id;

		const userResponse = {
			_id: user._id,
			username: user.username,
			name: user.name,
			email: user.email,
			city: user.city,
			country: user.country,
			lat: user.lat,
			lon: user.lon,
			tradingRadius: user.tradingRadius,
			userPreferences: user.userPreferences,
			inventory: user.inventory,
			isPrivate: user.isPrivate,
			createdAt: user.createdAt,
		};

		res.status(StatusCodes.OK).json(userResponse);
	} catch (err) {
		console.error("Error logging in:", err);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Server error. Could not login.",
		});
	}
};

const getUser = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id)
			.populate("inventory")
			.populate("userPreferences.category")
			.select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		res.status(200).json(user);
	} catch (err) {
		console.error("Error fetching user:", err);
		res.status(500).json({ error: "Server error. Could not fetch user." });
	}
};

const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { username, tradingRadius, name, email, city, country } =
			req.body;

		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		if (username && username !== user.username) {
			const existingUser = await User.findOne({ username });
			if (existingUser) {
				return res
					.status(StatusCodes.CONFLICT)
					.json({ error: "Username already exists." });
			}
		}

		if (email && email !== user.email) {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return res
					.status(StatusCodes.CONFLICT)
					.json({ error: "Email already exists." });
			}
		}

		const updateData = {};
		if (username) updateData.username = username;
		if (name) updateData.name = name;
		if (email) updateData.email = email;
		if (city) updateData.city = city;
		if (country) updateData.country = country;
		if (tradingRadius) updateData.tradingRadius = tradingRadius;

		const updatedUser = await User.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		})
			.select("-password")
			.populate("userPreferences.category");

		const userResponse = {
			_id: updatedUser._id,
			username: updatedUser.username,
			name: updatedUser.name,
			email: updatedUser.email,
			city: updatedUser.city,
			country: updatedUser.country,
			lat: updatedUser.lat,
			lon: updatedUser.lon,
			tradingRadius: updatedUser.tradingRadius,
			inventory: updatedUser.inventory,
			userPreferences: updatedUser.userPreferences,
			createdAt: updatedUser.createdAt,
			updatedAt: updatedUser.updatedAt,
		};

		res.status(StatusCodes.OK).json(userResponse);
	} catch (err) {
		console.error("Error updating user:", err);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Server error. Could not update user.",
		});
	}
};

const updateUserPreferences = async (req, res) => {
	try {
		const { id } = req.params;
		const { userPreferences } = req.body;

		if (!Array.isArray(userPreferences)) {
			return res
				.status(400)
				.json({ error: "userPreferences must be an array." });
		}

		const validatedPreferences = [];

		for (const pref of userPreferences) {
			if (
				!pref ||
				typeof pref !== "object" ||
				typeof pref.category !== "string" ||
				typeof pref.description !== "string"
			) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					error: "Each preference must have a 'category' ObjectId string and a 'description'.",
				});
			}

			const category = await Category.findById(pref.category);
			if (!category) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					error: `Category with id ${pref.category} does not exist.`,
				});
			}

			validatedPreferences.push({
				category: category._id,
				description: pref.description,
			});
		}

		const user = await User.findById(id);
		if (!user) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: "User not found." });
		}

		user.userPreferences = validatedPreferences;
		await user.save();

		await user.populate("userPreferences.category");
		const userObj = user.toObject();
		delete userObj.password;

		res.status(StatusCodes.OK).json({
			message: "User preferences updated.",
			user: userObj,
		});
	} catch (err) {
		console.error("Error updating user preferences:", err);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Server error. Could not update users preferences.",
		});
	}
};

const updateUserPrivacy = async (req, res) => {
	try {
		const { id } = req.params;
		const { isPrivate } = req.body;

		if (typeof isPrivate !== "boolean") {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: "isPrivate must be a boolean value.",
			});
		}

		const user = await User.findById(id);
		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found." });
		}

		user.isPrivate = isPrivate;
		await user.save();

		const userResponse = {
			_id: user._id,
			username: user.username,
			name: user.name,
			email: user.email,
			city: user.city,
			country: user.country,
			lat: user.lat,
			lon: user.lon,
			tradingRadius: user.tradingRadius,
			inventory: user.inventory,
			userPreferences: user.userPreferences,
			isPrivate: user.isPrivate,
			createdAt: user.createdAt,
		};

		res.status(StatusCodes.OK).json(userResponse);
	} catch (err) {
		console.error("Error updating user privacy:", err);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Server error. Could not update user privacy.",
		});
	}
};

const updateUserPassword = async (req, res) => {
	try {
		const { id } = req.params;
		const { currentPassword, newPassword } = req.body;

		if (!currentPassword || !newPassword) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: "Current and new password are required." });
		}

		const user = await User.findById(id);
		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found." });
		}

		const isMatch = await compare(currentPassword, user.password);
		if (!isMatch) {
			return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Current password is incorrect." });
		}

		if (newPassword.length < 1) {
			return res.status(StatusCodes.BAD_REQUEST).json({ error: "New password cannot be empty." });
		}

		const hashedPassword = await hash(newPassword, Math.floor(Math.random() * 10) + 1);
		user.password = hashedPassword;
		await user.save();

		res.status(StatusCodes.OK).json({ message: "Password updated successfully." });
	} catch (err) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Server error. Could not update password." });
	}
};

const getRecommendationByUserID = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id)
			.populate("userPreferences.category")
			.select("-password");

		if (!user) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: "User not found." });
		}

		const recommendedProducts = await getRecommendationsForUser(user);

		res.status(StatusCodes.OK).json({
			data: recommendedProducts,
		});
	} catch (err) {
		console.error("Error recommending things:", err);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: `Server error. Could not recommend: ${err}`,
		});
	}
};

const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}
		res.status(200).json({ message: "User deleted successfully." });
	} catch (err) {
		res.status(500).json({ error: "Server error. Could not delete user." });
	}
};

export {
	createUser,
	loginUser,
	getUser,
	updateUser,
	updateUserPreferences,
	getRecommendationByUserID,
	deleteUser,
	updateUserPrivacy,
	updateUserPassword,
};

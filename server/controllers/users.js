import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { hash, compare } from "bcrypt";

const DEFAULT_USER_RADIUS = 10;
const HASH_ROUNDS = 10;

const createUser = async (req, res) => {
	try {
		const { username, name, password, city, country, tradingRadius } =
			req.body;

		if (!username || !name || !password || !city || !country) {
			return res.status(400).json({
				error: "Username, name, password, city, and country are required.",
			});
		}

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res
				.status(StatusCodes.CONFLICT)
				.json({ error: "Username already exists." });
		}

		const hashedPassword = await hash(password, HASH_ROUNDS);

		const newUser = new User({
			username,
			name,
			password: hashedPassword,
			city,
			country,
			tradingRadius: tradingRadius || DEFAULT_USER_RADIUS,
		});

		await newUser.save();

		const userResponse = {
			_id: newUser._id,
			username: newUser.username,
			name: newUser.name,
			city: newUser.city,
			country: newUser.country,
			tradingRadius: newUser.tradingRadius,
			inventory: newUser.inventory,
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

		const user = await User.findOne({ username }).populate("inventory");
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
			city: user.city,
			country: user.country,
			tradingRadius: user.tradingRadius,
			inventory: user.inventory,
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
			.populate("inventory") // Populate inventory items
			.select("-password"); // Exclude password from response

		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		res.status(200).json(user);
	} catch (err) {
		console.error("Error fetching user:", err);
		res.status(500).json({ error: "Server error. Could not fetch user." });
	}
};

export { createUser, loginUser, getUser };

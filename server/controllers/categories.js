import Category from "../models/Category.js";
import { StatusCodes } from "http-status-codes";

const createCategory = async (req, res) => {
	try {
		const { name } = req.body;

		if (!name) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: "Category name is required." });
		}

		const existing = await Category.findOne({ name });
		if (existing) {
			return res
				.status(StatusCodes.CONFLICT)
				.json({ error: "Category already exists." });
		}

		const category = new Category({ name });
		await category.save();

		res.status(StatusCodes.CREATED).json(category);
	} catch (err) {
		console.error("Error creating category:", err);
		res.status(500).json({
			error: "Server error. Could not create category.",
		});
	}
};

const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find().sort({ name: 1 }); // Alphabetical order
		res.status(StatusCodes.OK).json(categories);
	} catch (err) {
		console.error("Error fetching categories:", err);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Server error. Could not fetch categories.",
		});
	}
};

export {
	createCategory,
	getAllCategories,
};

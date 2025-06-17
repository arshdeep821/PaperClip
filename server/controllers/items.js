import Item from "../models/Item";
import { findById } from "../models/User";
import { findById as _findById } from "../models/Category";

import { StatusCodes } from "http-status-codes";

const createItem = async (req, res) => {
	try {
		const { name, description, category, owner } = req.body;

		// Basic validation
		if (!name || !description || !category || !owner) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: "name, description, category, and owner are required.",
			});
		}

		// Check if category exists
		const existingCategory = await _findById(category);
		if (!existingCategory) {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json({ error: "Category not found." });
		}

		// Check if owner exists
		const existingOwner = await findById(owner);
		if (!existingOwner) {
			return res.status(404).json({ error: "Owner (User) not found." });
		}

		// Create and save the item
		const newItem = new Item({ name, description, category, owner });
		await newItem.save();

		// Add item to user's inventory
		existingOwner.inventory.push(newItem._id);
		await existingOwner.save();

		res.status(StatusCodes.CREATED).json(newItem);
	} catch (err) {
		console.error("Error creating item:", err);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Server error. Could not create item.",
		});
	}
};

export { createItem };

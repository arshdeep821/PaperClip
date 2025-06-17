import Item from "../models/Item.js";
import User from "../models/User.js";
import Category from "../models/Category.js";

import { StatusCodes } from "http-status-codes";
import fs from "fs"
import path from "path"

const createItem = async (req, res) => {
    try {

        console.log(req.body);
        
        const { name, description, category, owner, condition } = req.body;

        // Basic validation
        if (!name || !description || !category || !owner || !condition) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "name, description, category, owner and condition are required.",
            });
        }

        if (!req.file) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: "Image file is required.",
			});
		}

        const imagePath = `./public/${req.file.filename}`

        // Check if category exists
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "Category not found." });
        }

        // Check if owner exists
        const existingOwner = await User.findById(owner);
        if (!existingOwner) {
            return res.status(404).json({ error: "Owner (User) not found." });
        }

        // Create and save the item
        const newItem = new Item({ name, description, category, owner, condition, imagePath });
        await newItem.save();

        // Add item to user's inventory
        existingOwner.inventory.push(newItem._id);
        await existingOwner.save();

        const imageFile = fs.readFileSync(imagePath)
        const base64Image = `data:image/jpeg;base64,${imageFile.toString('base64')}`;

        const newItemObj = { ...newItem.toObject(), image: base64Image }

        res.status(StatusCodes.CREATED).json(newItemObj);
    } catch (err) {
        console.error("Error creating item:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Server error. Could not create item.",
        });
    }
};

export { createItem };

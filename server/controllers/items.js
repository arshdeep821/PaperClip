import Item from "../models/Item.js";
import User from "../models/User.js";
import Category from "../models/Category.js";

import { StatusCodes } from "http-status-codes";
import fs from "fs"
import path from "path"
import mongoose from "mongoose";

import { refreshModel } from "../util/recommender.js";

const createItem = async (req, res) => {
    try {

        const { name, description, category, owner, condition } = req.body;

        // Basic validation
        if (!name || !description || !category || !owner || !condition) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "name, description, category, owner and condition are required.",
            });
        }

        // check if image exists
        if (!req.file) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Image file is required.",
            });
        }

        // get image path
        // const imagePath = `./public/${req.file.filename}`
        const imagePath = `${req.file.filename}`

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

        // get image and convert to base64
        // const imageFile = fs.readFileSync(`./public/${imagePath}`)
        // const base64Image = `data:image/jpeg;base64,${imageFile.toString('base64')}`;

		refreshModel();

        const newItemWithCategory = await Item.findById(newItem._id).populate("category");

        // create new object that will be returned
        const newItemObj = { ...newItemWithCategory.toObject() }

        res.status(StatusCodes.CREATED).json(newItemObj);
    } catch (err) {
        console.error("Error creating item:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Server error. Could not create item.",
        });
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        // validation
        const item = await Item.findById(id);
        if (!item) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Item not found." });
        }

        // if image exists, delete it
        if (item.imagePath) {
            const imageFullPath = path.resolve(`./public/${item.imagePath}`);
            if (fs.existsSync(imageFullPath)) {
                fs.unlinkSync(imageFullPath);
            }
        }

        // get rid of the item from user inventory
        const owner = await User.findById(item.owner);
        if (owner) {
            owner.inventory = owner.inventory.filter(id => id.toString() !== id);
            await owner.save();
        }

        // delete item
        await Item.findByIdAndDelete(id);

		refreshModel();

        res.status(StatusCodes.OK).json({ message: "Item deleted successfully." });
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Server error. Could not delete item.",
        });
    }
}

const updateItem = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, description, category, condition } = req.body;

        const item = await Item.findById(id);
        if (!item) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Item not found." });
        }

        if (category) {
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(StatusCodes.NOT_FOUND).json({ error: "Category not found." });
            }
            item.category = category;
        }

        if (name) {
            item.name = name;
        }
        if (description) {
            item.description = description;

        }
        if (condition) {
            item.condition = condition;
        }

        if (req.file) {
            // const newImagePath = `./public/${req.file.filename}`;
            const newImagePath = `${req.file.filename}`


            // Delete old image
            if (item.imagePath && fs.existsSync(`./public/${item.imagePath}`)) {
                fs.unlinkSync(item.imagePath);
            }

            item.imagePath = newImagePath;
        }

        await item.save();

		refreshModel();

        // const imageFile = fs.readFileSync(item.imagePath);
        // const base64Image = `data:image/jpeg;base64,${imageFile.toString("base64")}`;

        res.status(StatusCodes.OK).json({ ...item.toObject() });
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Server error. Could not update item.",
        });
    }
}

const getProducts = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: "Please provide user ID" })
        }

        const items = await Item.find({ owner: { $ne: id } })
            .populate("category") // populate the full category object
            .populate("owner");   // optional: also populate the owner if needed

        res.status(StatusCodes.OK).json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch items." });
    }
};

const getAllproducts = async (req, res) => {
	try {
		const allItems = await Item.find({})
			.populate("category") // populate the full category object

		res.status(StatusCodes.OK).json(allItems);
	} catch (error) {
		console.error("Error fetching all items:", error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			error: "Failed to fetch all items.",
		});
	}
};

const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        const { id } = req.params;

        if (!query || query.trim() === "") {
            return res.status(400).json({ error: "Search query is required." });
        }

        const terms = query.trim().split(/\s+/);

        // Build the $and array of OR conditions for each term
        const andConditions = terms.map((term) => ({
            $or: [
                { name: { $regex: term, $options: "i" } },
                { description: { $regex: term, $options: "i" } },
                { condition: { $regex: term, $options: "i" } },
                { "owner.username": { $regex: term, $options: "i" } },
                { "category.name": { $regex: term, $options: "i" } },
            ],
        }));

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid user ID." });
        }

        const userObjectId = new mongoose.Types.ObjectId(id);

        // don't want to return items that the user owns
        andConditions.push({
            "owner._id": { $ne: userObjectId }
        });

        const items = await Item.aggregate([
            {
                $lookup: {
                    from: "Users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                },
            },
            {
                $lookup: {
                    from: "Categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: "$owner" },
            { $unwind: "$category" },
            { $match: { $and: andConditions } },
        ]);

        // Build user search conditions
        const userConditions = terms.map((term) => ({
            $or: [
                { username: { $regex: term, $options: "i" } },
                { name: { $regex: term, $options: "i" } },
                { city: { $regex: term, $options: "i" } },
                { country: { $regex: term, $options: "i" } },
            ],
        }));

        // Exclude current user from user results
        const users = await User.find({
            $and: [
                { _id: { $ne: userObjectId } },
                ...userConditions
            ]
        })
            .select("-password")
            .populate({
                path: "inventory",
                populate: { path: "category" }
            });

        res.status(200).json({ items, users });

    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export { createItem, deleteItem, updateItem, getProducts, searchProducts, getAllproducts };


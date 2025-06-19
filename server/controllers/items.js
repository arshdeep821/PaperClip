import Item from "../models/Item.js";
import User from "../models/User.js";
import Category from "../models/Category.js";

import { StatusCodes } from "http-status-codes";
import fs from "fs"
import path from "path"

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

        // get image and convert to base64
        const imageFile = fs.readFileSync(imagePath)
        const base64Image = `data:image/jpeg;base64,${imageFile.toString('base64')}`;

        const newItemWithCategory = await Item.findById(newItem._id).populate("category");

        // create new object that will be returned
        const newItemObj = { ...newItemWithCategory.toObject(), image: base64Image }

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
            const imageFullPath = path.resolve(item.imagePath);
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
            const newImagePath = `./public/${req.file.filename}`;

            // Delete old image
            if (item.imagePath && fs.existsSync(item.imagePath)) {
                fs.unlinkSync(item.imagePath);
            }

            item.imagePath = newImagePath;
        }

        await item.save();

        const imageFile = fs.readFileSync(item.imagePath);
        const base64Image = `data:image/jpeg;base64,${imageFile.toString("base64")}`;

        res.status(StatusCodes.OK).json({ ...item.toObject(), image: base64Image });
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Server error. Could not update item.",
        });
    }
}

export { createItem, deleteItem, updateItem };

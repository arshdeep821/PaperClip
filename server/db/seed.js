import mongoose from "mongoose";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Item from "../models/Item.js";
import Trade from "../models/Trade.js";
import { hash } from "bcrypt";

const categories = [
	{ name: "Electronics" },
	{ name: "Sports" },
	{ name: "Clothing" },
	{ name: "Books" },
	{ name: "Furniture" },
];

const HASH_ROUNDS = 10;
let hashedPassword = await hash("password", HASH_ROUNDS);

const adminUser = {
	_id: new mongoose.Types.ObjectId("123456789012345678901234"),
	username: "Admin",
	name: "Admin Name",
	email: "admin@example.com",
	password: hashedPassword,
	city: "Vancouver",
	country: "Canada",
};

const adminItems = [
	{
		name: "iPhone 15",
		description: "Latest iPhone model in perfect condition",
		condition: "New",
		imagePath: "iPhone.png",
	},
	{
		name: "Basketball",
		description: "Spalding NBA Basketball",
		condition: "Used",
		imagePath: "Basketball.png",
	},
	{
		name: "Stephen Curry Shirt",
		description: "Golden State Warriors Stephen Curry T Shirt",
		condition: "Used",
		imagePath: "T-shirt.png",
	},
	{
		name: "Harry Potter And the Sorcerers stone",
		description: "Original copy of harry potter and the sorcerers stone",
		condition: "Damaged",
		imagePath: "Harry-Potter.png",
	},
	{
		name: "Comfy Chair",
		description: "Old chair that can seat 1 person",
		condition: "Damaged",
		imagePath: "Chair.png",
	},
];

hashedPassword = await hash("password", HASH_ROUNDS);
const execUser = {
	username: "Exec",
	name: "Exec Name",
	email: "exec@example.com",
	password: hashedPassword,
	city: "Toronto",
	country: "Canada",
};

const execItems = [
	{
		name: "Macbook Pro",
		description: "Apple Macbook Pro (16 inch, 2024)",
		condition: "Used",
		imagePath: "Macbook.png",
	},
	{
		name: "Soccer Ball",
		description: "Premier League 24-25 - Nike",
		condition: "New",
		imagePath: "Soccerball.png",
	},
	{
		name: "Naruto Shirt",
		description: "Naruto Shippuden Kakashi Hatake Shirt",
		condition: "New",
		imagePath: "NarutoShirt.png",
	},
	{
		name: "Shadow and Bone",
		description: "Two Copies of Shadow and Bone Book",
		condition: "Used",
		imagePath: "ShadowAndBone.png",
	},
	{
		name: "Metal Stool",
		description: "Sturdy Metal Stool",
		condition: "Used",
		imagePath: "Stool.png",
	},
];

hashedPassword = await hash("password", HASH_ROUNDS);
const dummyUser = {
	username: "dummy",
	name: "dummy Name",
	email: "dummyemail@gmail.com",
	password: hashedPassword,
	city: "Calgary",
	country: "Canada",
};

const seedDatabase = async () => {
	try {
		// Clear existing data
		await Trade.deleteMany({});
		await User.deleteMany({});
		await Category.deleteMany({});
		await Item.deleteMany({});
		console.log("Cleared existing data");

		// Create categories
		const createdCategories = await Category.insertMany(categories);
		console.log("Created categories");

		// Create single user with specific ID
		let createdUser = await User.create(adminUser);
		console.log("Created Admin user with ID:", createdUser._id);

		// Add Admin users preferences
		const furnitureCategory = createdCategories.find(
			(c) => c.name === "Furniture"
		);
		const sportsCategory = createdCategories.find(
			(c) => c.name === "Sports"
		);
		createdUser.userPreferences = [
			{
				category: furnitureCategory._id,
				description: "I want stools and couches",
			},
			{
				category: sportsCategory._id,
				description: "basketballs",
			},
		];
		console.log("Added preferences to user with ID:", createdUser._id);
		await createdUser.save();

		// Create items with references to the single user
		let itemsWithRefs = adminItems.map((item, index) => ({
			...item,
			category: createdCategories[index % createdCategories.length]._id,
			owner: createdUser._id,
		}));

		let createdItems = await Item.insertMany(itemsWithRefs);
		console.log("Created Admin items");

		// Update user with all items in inventory
		await User.findByIdAndUpdate(createdUser._id, {
			inventory: createdItems.map((item) => item._id),
		});
		console.log("Updated Admin user inventory");

		createdUser = await User.create(execUser);
		console.log("Created Exec user with ID:", createdUser._id);

		// Add Exec users preferences
		const electronicsCategory = createdCategories.find(
			(c) => c.name === "Electronics"
		);
		createdUser.userPreferences = [
			{
				category: electronicsCategory._id,
				description: "I want iPhones and tech gadgets",
			},
		];
		console.log("Added preferences to user with ID:", createdUser._id);
		await createdUser.save();

		itemsWithRefs = execItems.map((item, index) => ({
			...item,
			category: createdCategories[index % createdCategories.length]._id,
			owner: createdUser._id,
		}));

		createdItems = await Item.insertMany(itemsWithRefs);
		console.log("Created Exec items");

		await User.findByIdAndUpdate(createdUser._id, {
			inventory: createdItems.map((item) => item._id),
		});
		console.log("Updated Exec user inventory");

		const admin = await User.findOne({ username: "Admin" }).populate(
			"inventory"
		);
		const exec = await User.findOne({ username: "Exec" }).populate(
			"inventory"
		);

		const trade = await Trade.create({
			user1: admin._id,
			user2: exec._id,
			items1: [admin.inventory[0]], // first Admin item
			items2: [
				exec.inventory[exec.inventory.length - 1],
				exec.inventory[exec.inventory.length - 2],
			], // last Exec item
		});

		console.log("Created trade between Admin and Exec:", trade._id);

		createdUser = await User.create(dummyUser);
		console.log("Created Dummy user with ID:", createdUser._id);

		console.log("Database seeded successfully!");
	} catch (error) {
		console.error("Error seeding database:", error);
	}
};

export default seedDatabase;

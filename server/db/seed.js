import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Item from '../models/Item.js';
import fs from 'fs';
import path from 'path';

const categories = [
    { name: 'Electronics' },
    { name: 'Clothing' },
    { name: 'Books' },
    { name: 'Furniture' },
    { name: 'Sports' }
];

const user = {
    _id: new mongoose.Types.ObjectId('123456789012345678901234'),
    username: "Admin",
    password: "password",
    location: "Vancouver"
}


const items = [
    {
        name: 'iPhone 15',
        description: 'Latest iPhone model in perfect condition',
        condition: 'New',
        imagePath: "./public/iPhone.png"
    }
];

const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Item.deleteMany({});
        console.log('Cleared existing data');

        // Create categories
        const createdCategories = await Category.insertMany(categories);
        console.log('Created categories');

        // Create single user with specific ID
        const createdUser = await User.create(user);
        console.log('Created user with ID:', createdUser._id);

        // Create items with references to the single user
        const itemsWithRefs = items.map((item, index) => ({
            ...item,
            category: createdCategories[index % createdCategories.length]._id,
            owner: createdUser._id
        }));

        const createdItems = await Item.insertMany(itemsWithRefs);
        console.log('Created items');

        // Update user with all items in inventory
        await User.findByIdAndUpdate(
            createdUser._id,
            { inventory: createdItems.map(item => item._id) }
        );
        console.log('Updated user inventory');

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

export default seedDatabase;
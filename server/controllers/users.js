const User = require("../models/User")
const { StatusCodes } = require('http-status-codes');

const createUser = async (req, res) => {
    try {
        const { username, password, location, tradingRadius } = req.body;

        // Basic validation
        if (!username || !password || !location) {
            return res.status(400).json({ error: 'Username, password, and location are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({ error: 'Username already exists.' });
        }

        const newUser = new User({
            username,
            password,
            location,
            tradingRadius: tradingRadius || 10 // default to 10 if not provided
        });

        await newUser.save();

        const userResponse = {
            _id: newUser._id,
            username: newUser.username,
            location: newUser.location,
            tradingRadius: newUser.tradingRadius,
            inventory: newUser.inventory,
            createdAt: newUser.createdAt
        };

        res.status(StatusCodes.CREATED).json(userResponse);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Server error. Could not create user.' });
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .populate('inventory') // Populate inventory items
            .select('-password');  // Exclude password from response

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Server error. Could not fetch user.' });
    }
}

module.exports = {
    createUser,
    getUser
}
import Trade from "../models/Trade.js"
import { StatusCodes } from "http-status-codes";

// Controller to create a new trade between two users
const createTrade = async (req, res) => {
    try {
        const { user1, user2, items1, items2 } = req.body;

        // Basic validation
        if (!user1 || !user2 || !Array.isArray(items1) || !Array.isArray(items2) || items1.length === 0 || items2.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "user1, user2, items1, and items2 are required and must be non-empty arrays."
            });
        }

        // Create the trade
        const newTrade = new Trade({
            user1,
            user2,
            items1,
            items2,
            status: "pending"
        });
        await newTrade.save();

        const populatedTrade = await Trade.findById(newTrade._id)
            .populate('user1')
            .populate('user2')
            .populate('items1')
            .populate('items2')

        res.status(StatusCodes.CREATED).json(populatedTrade);
    } catch (err) {
        console.error("Error creating trade:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Server error. Could not create trade."
        });
    }
};

const getTradesByUserId = async (req, res) => {
    try {
        const { id } = req.params;

        // Basic validation
        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "userId is required."
            });
        }

        // Find all trades where the user is either user1 or user2
        const trades = await Trade.find({ user1: id })
            .populate('user1')
            .populate('user2')
            .populate('items1')
            .populate('items2')
            .sort({ createdAt: -1 }); // sort by newest first

        res.status(StatusCodes.OK).json(trades);

    } catch (err) {
        console.error("Error fetching trades:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Server error. Could not fetch trades."
        });
    }
}

export { createTrade, getTradesByUserId };


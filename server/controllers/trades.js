import Trade from "../models/Trade"
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

        res.status(StatusCodes.CREATED).json(newTrade);
    } catch (err) {
        console.error("Error creating trade:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Server error. Could not create trade."
        });
    }
};

export { createTrade };


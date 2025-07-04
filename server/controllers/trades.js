import { StatusCodes } from "http-status-codes";
import Trade from "../models/Trade.js"

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
        const { userId } = req.params;

        // Basic validation
        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "userId is required."
            });
        }

        // Find all trades where the user is either user1 or user2
        const trades = await Trade.find({ user1: userId })
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
};

const updateTradeStatus = async (req, res) => {
    try {
        const { tradeId } = req.params;

        const { status } = req.body;

		const validStatuses = ["pending", "accepted", "rejected", "cancelled"];
		if (status && !validStatuses.includes(status)) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				error: `Invalid status. Must be one of: ${validStatuses}`,
			});
		}

        const trade = await Trade.findById(tradeId);
        if (!trade) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Trade not found." });
        }

		trade.status = status;

        await trade.save();

        res.status(StatusCodes.OK).json({ ...trade.toObject() });
    } catch (err) {
        console.error("Error updating trade:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Server error. Could not update trade.",
        });
    }
};

export { createTrade, getTradesByUserId, updateTradeStatus };


import { StatusCodes } from "http-status-codes";
import Trade from "../models/Trade.js"
import User from "../models/User.js";
import Item from "../models/Item.js";
import { it } from "mocha";

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

const getTradesByUser1Id = async (req, res) => {
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



const getTradesByUser2Id = async (req, res) => {
    try {
        const { id } = req.params;

        // Basic validation
        if (!id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "userId is required."
            });
        }

        // Find all trades where the user is either user1
        const trades = await Trade.find({ user2: id })
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

const executeTrade = async (req, res) => {
    try {
        const { user1Id, user2Id, items1Id, items2Id } = req.body;

        if (!user1Id || !user2Id || !Array.isArray(items1Id) || !Array.isArray(items2Id)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid request body" });
        }

        const user1 = await User.findById(user1Id);
        const user2 = await User.findById(user2Id);
        const items1 = await Item.find({ _id: { $in: items1Id } });
        const items2 = await Item.find({ _id: { $in: items2Id } });

        if (!user1) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "User1 not found." });
        }
        if (!user2) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "User2 not found." });
        }
        if (items1.length !== items1Id.length) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Some items in items1 were not found." });
        }
        if (items2.length !== items2Id.length) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Some items in items2 were not found." });
        }

        const isUser1OwnerOfAllItems1 = items1Id.every((id) => user1.inventory.includes(id.toString()));
        const isUser2OwnerOfAllItems2 = items2Id.every((id) => user2.inventory.includes(id.toString()));

        if (!isUser1OwnerOfAllItems1) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "user1 is not the owner of all items1" });
        }
        if (!isUser2OwnerOfAllItems2) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "user2 is not the owner of all items2" });
        }

        // swaps items from user.inventory
        user1.inventory = user1.inventory.filter((itemId) => !items1Id.includes(itemId.toString()));
        user2.inventory = user2.inventory.filter((itemId) => !items2Id.includes(itemId.toString()));

        user1.inventory.push(...items2Id);
        user2.inventory.push(...items1Id);

        // changes item.owner
        items1.forEach((item) => {
            item.owner = user2Id;
        });
        items2.forEach((item) => {
            item.owner = user1Id;
        });

        await Promise.all([
            user1.save(),
            user2.save(),
            ...items1.map(item => item.save()),
            ...items2.map(item => item.save()),
        ]);

        res.status(StatusCodes.OK).json({
            message: "Trade executed successfully.",
            user1Inventory: user1.inventory,
            user2Inventory: user2.inventory,
        });
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Server error during trade execution",
        });
    }
};

const getHistory = async (req, res) => {
    const { itemId } = req.params;

    try {
        const trades = await Trade.find({
            status: "accepted",
            $or: [
                { items1: itemId },
                { items2: itemId }
            ]
        }).populate("user1").populate("user2").populate("items1").populate("items2");

        res.status(200).json(trades);
    } catch (error) {
        console.error("Error fetching trade history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export { createTrade, getTradesByUser1Id, getTradesByUser2Id, updateTradeStatus, executeTrade, getHistory };

import Message from "../models/Message.js"
import User from "../models/User.js"
import { StatusCodes } from "http-status-codes";

// get messages between two users
const getMessage = async (req, res) => {
    try {
        const { user1, user2 } = req.params;
        const messages = await Message.find({
            $or: [
                { from: user1, to: user2 },
                { from: user2, to: user1 }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Server error. Could not fetch messages."
        });
    }
}

// create a new message
const createMessage = async (req, res) => {
    try {
        const { from, to, message } = req.body;
        const newMsg = new Message({ from, to, message });
        await newMsg.save();
        res.status(201).json(newMsg);
    } catch (error) {
        console.error("Error creating message:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Server error. Could not create message."
        });
    }
}

// get conversations for a user
// conversations for a specific user are the latest messages with other users
const getConversations = async (req, res) => {
    const { userId } = req.params;

    // Find all messages where the user is either sender or receiver
    const messages = await Message.find({
        $or: [{ from: userId }, { to: userId }]
    }).sort({ timestamp: -1 });

    // Use a Map to keep only the latest message per conversation
    const conversationsMap = new Map();

    messages.forEach(msg => {
        // The other user is the one who is NOT the current user
        const otherUserId =
            msg.from.toString() === userId ? msg.to.toString() : msg.from.toString();

        // Don't include self-conversations
        if (otherUserId === userId) return;

        // Only keep the latest message per conversation
        if (!conversationsMap.has(otherUserId)) {
            conversationsMap.set(otherUserId, msg);
        }
    });

    // Fetch user info for each conversation
    const conversations = await Promise.all(
        Array.from(conversationsMap.entries()).map(async ([otherUserId, lastMessage]) => {
            const otherUser = await User.findById(otherUserId).select("username profilePicture");
            if (!otherUser) return null;
            return {
                otherUser: { _id: otherUser._id, username: otherUser.username, profilePicture: otherUser.profilePicture },
                lastMessage
            };
        })
    );

    // Remove any nulls (in case a user was deleted)
    res.json(conversations.filter(Boolean));
};

export { getMessage, createMessage, getConversations };

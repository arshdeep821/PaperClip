import Message from "../models/Message.js"
import User from "../models/User.js"
import { StatusCodes } from "http-status-codes";

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

const getConversations = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find all messages where the user is either sender or receiver
        const messages = await Message.find({
            $or: [{ from: userId }, { to: userId }]
        }).sort({ timestamp: -1 });

        // Group messages by conversation partner
        const conversationsMap = new Map();
        
        messages.forEach(msg => {
            const otherUserId = msg.from === userId ? msg.to : msg.from;
            
            if (!conversationsMap.has(otherUserId.toString())) {
                conversationsMap.set(otherUserId.toString(), {
                    otherUserId: otherUserId,
                    lastMessage: msg,
                    unreadCount: 0
                });
            }
        });

        // Convert to array and populate user information
        const conversations = [];
        for (const [otherUserId, conversation] of conversationsMap) {
            try {
                const otherUser = await User.findById(otherUserId).select('username');
                if (otherUser) {
                    conversations.push({
                        otherUser: {
                            _id: otherUser._id,
                            username: otherUser.username
                        },
                        lastMessage: conversation.lastMessage,
                        unreadCount: conversation.unreadCount
                    });
                }
            } catch (error) {
                console.error(`Error fetching user ${otherUserId}:`, error);
            }
        }

        // Sort by last message timestamp
        conversations.sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
        });

        res.json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Server error. Could not fetch conversations."
        });
    }
}

export { getMessage, createMessage, getConversations };
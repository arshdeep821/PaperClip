import Message from "../models/Message.js"
import { StatusCodes } from "http-status-codes";

const getMessage = async (req, res) => {
    const { user1, user2 } = req.params;
    const messages = await Message.find({
        $or: [
            { from: user1, to: user2 },
            { from: user2, to: user1 }
        ]
    }).sort({ timestamp: 1 });
    res.json(messages);
}

const createMessage = async (req, res) => {
    const { from, to, message } = req.body;
    const newMsg = new Message({ from, to, message });
    await newMsg.save();
    res.status(201).json(newMsg);
}

export {
    getMessage,
    createMessage
}
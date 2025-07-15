import express from "express";
const router = express.Router();
import { getMessage, createMessage, getConversations } from "../controllers/messages.js"; 

router.post("/", createMessage);
router.get("/conversations/:userId", getConversations);
router.get("/:user1/:user2", getMessage);

export default router;

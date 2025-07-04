import express from "express";
const router = express.Router();
import { getMessage, createMessage } from "../controllers/messages.js"; 

router.post("/", createMessage);
router.get("/:user1/:user2", getMessage);

export default router;

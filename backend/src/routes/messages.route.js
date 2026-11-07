import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import upstashProtection from "../middleware/upstash.middleware.js";
import { getAllContacts, getMessagesById, sendMessage, getChatPartners } from "../controllers/message.controller.js";

const router = express.Router();

router.use(upstashProtection, protectRoute); // Apply upstashProtection and protectRoute middleware to all routes in this router

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesById);
router.post("/send/:id", sendMessage);

export default router;
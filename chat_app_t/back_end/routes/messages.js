import express from "express";
import { createMessage, getMessages } from "../Controllers/messages.js";

const router = express.Router();

router.post("/createMessage", createMessage);

router.get("/getMessages/:chatId", getMessages);

export default router;

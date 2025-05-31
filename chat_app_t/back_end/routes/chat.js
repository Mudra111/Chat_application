import express from "express";
import { createChat, findChat, findUserChats } from "../Controllers/chat.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createChat", authUser, createChat);

router.get("/find/:userId", authUser, findUserChats);

router.get("/find/:firstId/:secondId", authUser, findChat);

export default router;

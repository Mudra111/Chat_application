import express from "express";
import { findUser, getUsers } from "../Controllers/user.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authUser, getUsers);

router.get("/:userId", findUser);

export default router;

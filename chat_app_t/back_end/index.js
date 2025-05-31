import express from "express";
import cors from "cors";
const app = express();

import { connect } from "./config/database.js";

import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

//route import and mount
import auth from "./routes/auth.js";
app.use("/auth", auth);

import chat from "./routes/chat.js";
app.use("/chat", chat);

import user from "./routes/user.js";
app.use("/user", user);

import message from "./routes/messages.js";
app.use("/message", message);

//connect database
connect();

//start server
app.listen(PORT, () => {
  console.log(`server running on : ${PORT}`);
});

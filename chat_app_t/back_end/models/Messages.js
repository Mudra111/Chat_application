import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "chat" },
    senderId: String,
    text: String,
  },
  { timestamps: true }
);

export const Messages = mongoose.model("messages", messagesSchema);

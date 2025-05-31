import { Chat } from "../models/Chat.js";

//createChat
export const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  let chat;
  try {
    if (firstId == secondId) {
      chat = await Chat.findOne({
        members: [firstId],
        $expr: { $eq: [{ $size: "$members" }, 1] },
      });
    } else {
      chat = await Chat.findOne({
        members: { $all: [firstId, secondId] },
      });
    }

    console.log(chat);

    if (chat) {
      return res.status(200).json({ chat: chat, success: true });
    }

    let newChat;
    if (firstId == secondId) {
      newChat = new Chat({
        members: [firstId],
      });
    } else {
      newChat = new Chat({
        members: [firstId, secondId],
      });
    }

    const response = await newChat.save();

    return res.status(200).json({ chat: response, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//findUserChats
export const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await Chat.find({
      members: { $in: userId },
    });

    return res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//findChat
export const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await Chat.findOne({
      members: { $all: [firstId, secondId] },
    });

    return res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

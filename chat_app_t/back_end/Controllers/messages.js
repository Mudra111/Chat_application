import { Messages } from "../models/Messages.js";

//create message
export const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const newMessage = new Messages({
      chatId,
      senderId,
      text,
    });

    const response = newMessage.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//get message
export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  console.log(chatId);

  try {
    const messages = await Messages.find({ chatId });
    console.log(messages);

    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

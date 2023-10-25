const User = require("../models/user");
const statusCodes = require("../constants/status-code");
const Chat = require("../models/chat");
const user = require("../models/user");

exports.getAllChats = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("friends.user", ["name"])
      .populate("friends.chat", ["lastMessage"]);

    const chats = user.friends;
    res.status(statusCodes.success).json({ chats: chats });
  } catch (e) {
    throw e;
  }
};

exports.getChatMessages = async (req, res, next) => {
  try {
    const error = new Error("Server Error");
    const chatId = req.params.chatId;
    if (!chatId) {
      throw "Please Specify Chat Id";
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw "No Chat Found!";
    }

    const messages = chat.messages;
    return res.status(statusCodes.success).json(messages);
  } catch (e) {
    next(e);
  }
};

exports.sendMessage = async (userId, socket, message) => {
  try {
    console.log("new Message UserId: " + userId);
    const chatId = message.chatId;
    const textMessage = message.message;
    const createdOn = Date.now();
    message.createdOn = createdOn;
    socket.broadcast.emit(chatId, message);
    const chat = await Chat.findById(chatId);

    chat.lastMessage = textMessage;
    const messages = chat.messages;

    messageObj = { message: textMessage, sendBy: userId, createdOn: createdOn };
    console.log(messageObj);
    messages.push(messageObj);

    await chat.save();
  } catch (e) {
    console.log("Error: " + e);
  }
};

const User = require("../models/user");
const statusCodes = require("../constants/status-code");
const Chat = require("../models/chat");
exports.getAllFriends = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select([
      "name",
      "id",
      "email",
    ]);
    res.status(statusCodes.success).json({ users: users });
  } catch (e) {
    throw e;
  }
};

exports.sendFriendReq = async (req, res, next) => {
  try {
    const userId = req.body.userId;

    const requestFrndUser = await User.findById(userId);
    if (!requestFrndUser) {
      throw "User Not Found";
    }
    const user = await User.findById(req.userId);
    let requestList = user.friendRequest;
    requestList.push(requestFrndUser);
    user.friendRequest = requestList;
    user.save();
    return res
      .status(statusCodes.success)
      .json({ message: "friend Request Send" });
  } catch (e) {
    throw e;
    s;
  }
};

exports.getFriendReqs = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("friendRequest", [
      "name",
      "email",
    ]);

    const requests = await user.friendRequest;

    // const requests = user.friendRequest;

    res.status(statusCodes.success).json({ requests: requests });
  } catch (e) {
    throw e;
  }
};

//!! Fix Friend Request not getting deleted from db
exports.acceptFriendReq = async (req, res, next) => {
  try {
    const friendUserId = req.body.frndId;
    if (!friendUserId) {
      throw "Friend Id not found";
    }
    const friendUser = await User.findById(friendUserId);
    if (!friendUser) {
      throw "Friend Not Found!";
    }
    const user = await User.findById(req.userId);

    let requestList = user.friendRequest;

    if (!requestList.includes(friendUserId)) {
      throw "No Friend Request Found!";
    }
    const chat = new Chat({
      members: [friendUserId, user.id],
    });

    await chat.save();

    requestList.filter((val) => val == friendUserId);

    user.requestList = requestList;

    user.friends.push({ user: friendUser, chat: chat._id });

    friendUser.friends.push({ user: user, chat: chat._id });
    await user.save();
    await friendUser.save();

    return res
      .status(statusCodes.success)
      .json({ message: "Friend Added Successfully" });
  } catch (e) {
    throw e;
  }
};



// Create an API to get all the chats for that user.

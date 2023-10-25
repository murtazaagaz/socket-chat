const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    require: true,
    type: String,
  },
  name: {
    require: true,
    type: String,
  },
  password: {
    require: true,
    type: String,
  },
  profilePic: {
    require: false,
    type: String,
  },

  friendRequest: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
      autopopulate: true,
    },
  ],
  friends: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        autopopulate: true,
      },
      chat: { type: Schema.Types.ObjectId, ref: "chats", autopopulate: true },
    },
  ],
  //   chats: [
  //     {
  //       lastMessage: {
  //         type: Schema.Types.Date,
  //       },
  //       ids: [
  //         {
  //           typpe: Schema.Types.ObjectId,
  //           ref: "chats",
  //         },
  //       ],
  //     },
  //   ],
});
module.exports = mongoose.model("users", userSchema);

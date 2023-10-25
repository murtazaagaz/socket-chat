const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  messages: [
    {
      message: {
        type: String,
      },
      sendBy: {
        ref: "users",
        type: Schema.Types.ObjectId,
      },

      createdOn: Date,
    },
  ],

  lastMessage: {
    type: String,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});
module.exports = mongoose.model("chats", chatSchema);

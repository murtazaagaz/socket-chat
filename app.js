const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const statusCodes = require("./constants/status-code");
const multer = require("multer");
const path = require("path");
const authRoute = require("./routes/auth");
const friendsRoute = require("./routes/friends");
const chatRoute = require("./routes/chat");

const chatController = require("./controller/chat");
const io = require("./websocket/socket-io");
const app = express();
const utils = require("./utils/utils");
const user = require("./models/user");
require("dotenv").config();
main();
async function main() {
  const MONGO_DB_URI = process.env.db_url;
  await mongoose.connect(MONGO_DB_URI);

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*", "Authorization");
    res.setHeader(
      "Access-Control-Allow-Method",
      "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "*", "Authorization");
    next();
  });
  app.use(express.json());
  app.use(multer().single("image"));
  app.use("/auth", authRoute);
  app.use("/friends", friendsRoute);
  app.use("/chat", chatRoute);

  app.use((error, req, res, next) => {
    res.status(statusCodes.serverError).json({ error: error });
  });
  const server = app.listen(4000);
  console.log("!!Server Started!!");
  const i = io.init(server);
  try {
    i.on("connection", (socket) => {
      let userId;
      try {
        const token = socket.handshake.headers.authorisation;

        userId = utils.decodeToken(token);
      } catch (e) {
        socket.disconnect();
        return;
      }

      console.log("userID: " + userId);
      if (socket) {
        socket.on("chat", (message) => {
          console.log("*** New Chat ***");
          chatController.sendMessage(userId, socket, message);
          console.log(message);
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
}

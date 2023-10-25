const express = require("express");
const isAuth = require("../middleware/is-auth");
const router = express.Router();
const controller = require("../controller/chat");

router.get("/all", isAuth, controller.getAllChats);
router.get("/chat/:chatId", isAuth, controller.getChatMessages);

module.exports = router;

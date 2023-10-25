const express = require("express");
const isAuth = require("../middleware/is-auth");
const router = express.Router();
const controller = require("../controller/friends");

router.get("/all", isAuth, controller.getAllFriends);
router.post("/sendRequest", isAuth, controller.sendFriendReq);
router.get("/getFriendReqs", isAuth, controller.getFriendReqs);
router.post("/acceptFriendRequest", isAuth, controller.acceptFriendReq);
module.exports = router;

const express = require("express");
const router = express.Router();

const {
  recentPersonalChat,
  recentGroupChat,
  directMessage,
  groupMessage,
} = require("../controllers/chatController");

router.get("/personal/:receiver", directMessage);
router.get("/group/:groupId", groupMessage);
router.get("/recent/personal", recentPersonalChat);
router.get("/recent/group", recentGroupChat);

module.exports = router;

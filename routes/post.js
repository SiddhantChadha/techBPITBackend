const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPost,
  deletePost,
  community,
  eventPost,
  groupPost,
  updatePost,
} = require("../controllers/postController");

router.post("/create", createPost);
router.get("/all", getAllPost);
router.get("/all/event", eventPost);
router.get("/all/:groupId", groupPost);
router.delete("/delete/:postId", deletePost);
router.patch("/update/:postId", updatePost);
router.get("/community", community);

module.exports = router;

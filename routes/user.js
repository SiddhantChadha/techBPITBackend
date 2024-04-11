const express = require("express");
const router = express.Router();

const {
  getUser,
  updateUser,
  allUsers,
  searchUser,
  deleteUser,
  unblockUser,
  adminAllUsers,
} = require("../controllers/userController");
const { authRole } = require("../middleware/roleAuth");
const { ROLE } = require("../config");

router.get("/all", allUsers);
router.get("/admin/all", authRole(ROLE.ADMIN), adminAllUsers);
router.get("/search", searchUser);
router.patch("/update", updateUser);
router.get("/:userId", getUser);
router.delete("/delete/:userId", authRole(ROLE.ADMIN), deleteUser);
router.patch("/unblock/:userId", authRole(ROLE.ADMIN), unblockUser);

module.exports = router;

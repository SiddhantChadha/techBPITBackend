const express = require("express");
const router = express.Router();

const {
  createGroup,
  joinGroup,
  getGroup,
  leaveGroup,
  deleteGroup,
  groupsMentored,
  getAllGroups,
  toggleModeratorAccess,
} = require("../controllers/groupController");
const { authRole } = require("../middleware/roleAuth");
const { ROLE } = require("../config");

router.post("/create", authRole(ROLE.ADMIN), createGroup);
router.post("/join", joinGroup);
router.post("/access/toggle", authRole(ROLE.ADMIN), toggleModeratorAccess);
router.get("/get/all", authRole(ROLE.ADMIN), getAllGroups);
router.get("/get/:groupId", getGroup);
router.get("/:userId", groupsMentored);
router.patch("/leave/:groupId", leaveGroup);
router.delete("/delete/:groupId", authRole(ROLE.ADMIN), deleteGroup);

module.exports = router;

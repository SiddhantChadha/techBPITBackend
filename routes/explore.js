const express = require("express");
const router = express.Router();

const {
  globalSearch,
  suggestUser,
  suggestProject,
  suggestGroup,
  getRelevantAds,
} = require("../controllers/exploreController");

router.get("/all", globalSearch);
router.get("/user", suggestUser);
router.get("/project", suggestProject);
router.get("/group", suggestGroup);
router.get("/ad", getRelevantAds);

module.exports = router;

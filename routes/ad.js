const express = require("express");
const router = express.Router();

const {
  createAd,
  getAllAds,
  getAd,
  deleteAd,
  updateAd,
} = require("../controllers/adController");

router.post("/create", createAd);
router.get("/all/:userId", getAllAds);
router.patch("/update/:adId", updateAd);
router.get("/:adId", getAd);
router.delete("/delete/:adId", deleteAd);

module.exports = router;

const express = require("express");
const router = express.Router();
const paidAdController = require("../controllers/paidAdController");

router.post("/", paidAdController.createPaidAd);
router.get("/", paidAdController.getAllPaidAds);
router.delete("/:id", paidAdController.deletePaidAd);

module.exports = router;
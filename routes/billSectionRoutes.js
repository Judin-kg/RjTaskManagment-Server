const express = require("express");
const router = express.Router();
const { addBill, getBills } = require("../controllers/billSectionController");


router.post("/", addBill);
router.get("/", getBills);


module.exports = router;
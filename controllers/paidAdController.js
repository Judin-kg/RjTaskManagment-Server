const PaidAd = require("../models/PaidAd");

// CREATE
exports.createPaidAd = async (req, res) => {
  try {
    const paidAd = new PaidAd(req.body);
    const savedAd = await paidAd.save();
    res.status(201).json(savedAd);
  } catch (error) {
    res.status(500).json({ message: "Failed to create record", error });
  }
};

// GET ALL
exports.getAllPaidAds = async (req, res) => {
  try {
    const ads = await PaidAd.find().sort({ date: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch records", error });
  }
};

// DELETE
exports.deletePaidAd = async (req, res) => {
  try {
    await PaidAd.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete record", error });
  }
};
const BillSection = require("../models/BillSection");


exports.addBill = async (req, res) => {
try {
const data = await BillSection.create(req.body);
res.json({ success: true, message: "Bill added successfully", data });
} catch (err) {
res.status(500).json({ success: false, message: "Server Error", error: err.message });
}
};


exports.getBills = async (req, res) => {
try {
const bills = await BillSection.find().sort({ createdAt: -1 });
res.json({ success: true, bills });
} catch (err) {
res.status(500).json({ success: false, message: "Server Error", error: err.message });
}
};
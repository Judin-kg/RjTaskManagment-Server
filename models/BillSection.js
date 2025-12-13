const mongoose = require("mongoose");


const BillSectionSchema = new mongoose.Schema(
{
companyname: { type: String, required: true },
workdescription: { type: String, required: true },
amount: { type: Number, required: true },
date: { type: String, required: true },
discount: { type: Number, default: 0 },
narration: { type: String },
},
{ timestamps: true }
);


module.exports = mongoose.model("BillSection", BillSectionSchema);


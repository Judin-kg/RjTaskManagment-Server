const mongoose = require("mongoose");

const paidAdSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["reach", "lead"],
      required: true,
    },
    // platform: {
    //   type: String,
    //   enum: ["facebook", "instagram"],
    //   required: true,
    // },
    result:{
       type: Number,
      required: true,  
    },

    costperResult:{
       type: Number,
      required: true,  
    },

    totalMessages: {
      type: Number,
      default: 0,
    },
    newMessages: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaidAd", paidAdSchema);
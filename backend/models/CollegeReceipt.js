// Imports
const mongoose = require("mongoose");
const errors = require("../configs/error.codes.json");

// Constants
const schema = new mongoose.Schema(
  {
    collegeSecret: {
      type: String,
      required: [true, errors[400].collegeSecretRequired],
      unique: true,
      index: true,
    },
    transactionId: {
      type: String,
      required: [true, errors[400].transactionIdRequired],
      trim: true,
      unique: true,
      index: true,
    },
    collegeName: {
      type: String,
      required: [true, errors[400].collegeRequired],
    },
    amount: {
      type: Number,
      required: [true, errors[400].amountRequired],
      min: 0,
    },
    balanceLeft: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
schema.index({ collegeSecret: 1, transactionId: 1 });

module.exports = mongoose.model("college_receipt", schema);

const mongoose = require("mongoose");

const rentProgressSchema = new mongoose.Schema({
  rentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "rent",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RentSlots",
  },
  orderinfo: [{
    status: {
      type: String,
      enum: ["Slot Confirmed", "Under Rent", "Rent Completed", "Returned", "Cancelled"],
    },
    statusAt: {
      type: Date,
      default: Date.now,
    },
  }],
});

module.exports = mongoose.model("RentProgress", rentProgressSchema);

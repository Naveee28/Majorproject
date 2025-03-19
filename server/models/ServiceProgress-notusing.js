const mongoose = require("mongoose")

const serviceProgress = new mongoose.Schema({
    serviceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service",
      },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceSlots",
  },
  orderinfo: [{
                 status: {  type: String,
                 enum: ["Intiated","InProgress","Completed","Cancelled"],
                 },
                 statusAt: {
                    type: Date,
                    default: Date.now,
                },
  },]

})

module.exports = mongoose.model("ServiceProgress", serviceProgress)
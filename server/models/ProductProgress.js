const mongoose = require("mongoose")

const productProgress = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  orderinfo: [{
                 status: {  type: String,
                 enum: ["Order Confirmed", "Shipped","Out For Delivery","Delivered","Cancelled","Returned"],
                 },
                 statusAt: {
                    type: Date,
                    default: Date.now,
                },
  },]

})

module.exports = mongoose.model("ProductProgress", productProgress)
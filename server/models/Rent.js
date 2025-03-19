
const mongoose = require("mongoose")

// Define the service schema
const rentSchema = new mongoose.Schema({
  name: {
        type: String ,
        required:true
   },
  description: {
        type: String ,
        required:true
    },
    location: {
      type: String ,
      required:true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
 ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
    required:true
  },
  status: {
		type: String,
		enum: ["Draft", "Published"],
    default:"Draft",
    required:true
	  },
  thumbnail: {
    type: String,
    required:true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "category",
  },
  slots: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref : "RentSlots",
    required:true
  },
  
],
whatYouWillLearn: {
  type: String,
},
instructions: {
  type: [String],
},
  Since: { type: Date, default: Date.now },
})

module.exports = mongoose.models.rent ||mongoose.model("rent", rentSchema);


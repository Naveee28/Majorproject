const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
	rating: {
		type: Number,
		required: true,
	},
	review: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		enum: ["service", "product", "rent"],
		required: true,
	},
	ID: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		refPath: "type",
	},
});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
// Import the required modules
const express = require("express")
const router = express.Router()


// Categories Controllers Import
const {
    createRating ,
    getAverageRating,
    getAllRatingReview ,
    getServiceRatingReview,
    getRentItemRatingReview
} = require("../controllers/RatingAndReviews")

const { isUser, auth } = require('../middleware/Auth');

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************

router.post("/createRating", auth, isUser, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getAllRatingReview", getAllRatingReview)
router.post("/getServiceRatingReview", getServiceRatingReview)
router.post("/getRentItemRatingReview", getRentItemRatingReview)

module.exports = router

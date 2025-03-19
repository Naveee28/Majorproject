const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        thumbnail: {
            type: String,
            required:true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true,
        },
        status: {
            type: String,
            enum: ["Draft", "Published"],
          },
        ratingAndReviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "RatingAndReview",
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        productstatus: {
            type: String,
            enum: ["available", "out of stock"],
            default: "available",
        },
        quantity: {
            type: Number,
            default: 1,
        },
        peopleBought: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);

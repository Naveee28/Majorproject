const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
            //required: true,
        },
        accountType: {
            type: String,
            enum: ["user", "provider","admin"],
            required: true,
        },
        additionalDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "profile",
        },
        services: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "service",
            },
        ],
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
            },
        ],
        rents: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "rent",
                },
        ],
        wishlist:{
            services : [
             {   type:mongoose.Schema.Types.ObjectId,
                ref:"service",
            }
            ],
            rents : [{
                type : mongoose.Schema.Types.ObjectId,
                ref : "rent",
            }]
        },
        searchHistory: [
            {
            type: String,
        }
        ],
        activityHistory : [
            {
             type : String,
            }
        ],
        image: {
            type: String,
        },
        token: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);

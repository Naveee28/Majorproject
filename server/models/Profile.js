const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
    {
        gender: {
            type: String,
        },
        dateOfBirth: {
            type: Date,
        },
        about: {
            type: String,
        },
        address: {
           type:String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("profile", profileSchema);

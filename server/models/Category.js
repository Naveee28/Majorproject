const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: { type: String },
    status: {
        type: String,
        enum: ["Draft", "Published"],
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // Reference to the admin who created the category
        required: true,
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
});

module.exports = mongoose.model("category", categorySchema);
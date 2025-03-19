const Service = require('../models/Service');
const Rent = require('../models/Rent');
const User = require('../models/User');
const mongoose = require("mongoose");

// Function to add a service to the wishlist
const addServiceToWishlist = async (req, res) => {
    try {
        const { userId, serviceId } = req.body;


        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(serviceId)) {
            return res.status(400).json({ message: "Invalid userId or serviceId" });
        }

        const service = await Service.findById(serviceId);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.wishlist.services.includes(serviceId)) {
            user.wishlist.services.push(serviceId);
            user.activityHistory.push(service.name);
            await user.save();
        } else {
            return res.status(404).json({ message: "Service is already in your wishlist" });
        }

        res.status(200).json({ message: "Service added to wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to add a rent item to the wishlist
const addRentToWishlist = async (req, res) => {
    try {
        const { userId, rentItemId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(rentItemId)) {
            return res.status(400).json({ message: "Invalid userId or rentId" });
        }

        const user = await User.findById(userId);
        const rent = await Rent.findById(rentItemId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.wishlist.rents.includes(rentItemId)) {
            user.wishlist.rents.push(rentItemId);
            user.activityHistory.push(rent.name);
            await user.save();
        } else {
            return res.status(404).json({ message: "Rent Item is already in your wishlist" });
        }

        res.status(200).json({ message: "Rent item added to wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to remove a service from the wishlist
const removeServiceFromWishlist = async (req, res) => {
    try {
        const { userId, serviceId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(serviceId)) {
            return res.status(400).json({ message: "Invalid userId or serviceId" });
        }

        const user = await User.findById(userId);
        const service = await Rent.findById(serviceId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.wishlist.services.includes(serviceId)) {

            user.wishlist.services = user.wishlist.services.filter(
                (id) => id.toString() !== serviceId
            );

            user.activityHistory = user.activityHistory.filter(
                (entry) => !entry.includes(service.name)
            );

            await user.save();
        } else {
            return res.status(404).json({ message: "Service is not in your wishlist" });
        }

        res.status(200).json({ message: "Service removed from wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to remove a rent item from the wishlist
const removeRentFromWishlist = async (req, res) => {
    try {
        const { userId, rentItemId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(rentItemId)) {
            return res.status(400).json({ message: "Invalid userId or rentId" });
        }

        const user = await User.findById(userId);
        const rent = await Rent.findById(rentItemId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.wishlist.rents.includes(rentItemId)) {
            user.wishlist.rents = user.wishlist.rents.filter(
                (id) => id.toString() !== rentItemId
            );

            user.activityHistory = user.activityHistory.filter(
                (entry) => !entry.includes(rent.name)
            );

            await user.save();
        } else {
            return res.status(404).json({ message: "Rent Item is not in your wishlist" });
        }

        res.status(200).json({ message: "Rent item removed from wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to fetch the wishlist of a user
const fetchWishList = async (req, res) => {
    try {
        const { userId } = req.body; // Get the userId from request body

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        const user = await User.findById(userId).populate('wishlist.services').populate('wishlist.rents');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // const { wishlist } = user;

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch wishlist. Please try again.',
        });
    }
};

module.exports = {
    addServiceToWishlist,
    addRentToWishlist,
    removeServiceFromWishlist,
    removeRentFromWishlist,
    fetchWishList,
};

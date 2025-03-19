const express = require("express")
const router = express.Router()

const {
    addServiceToWishlist,
    removeServiceFromWishlist,
    addRentToWishlist,
    removeRentFromWishlist,
    fetchWishList,
} = require("../controllers/wishlist")

const { auth, isUser, isProvider } = require("../middleware/Auth")

router.post("/addServiceToWishlist", auth,isUser,addServiceToWishlist)
router.post("/removeServiceFromWishlist", auth,isUser,removeServiceFromWishlist)
router.post("/addRentToWishlist",auth,isUser,addRentToWishlist)
router.post("/removeRentFromWishlist", auth,isUser,removeRentFromWishlist)
router.post("/fetchWishList", auth,isUser,fetchWishList)

module.exports = router

// 2. User Management Endpoints:
//    - `/api/users/:userId` (GET): Get user details by user ID.
//    - `/api/users/:userId` (PUT): Update user details.
//    - `/api/users/:userId` (DELETE): Delete user account.


const express = require("express")
const router = express.Router()
const { auth,  isProvider } = require("../middleware/Auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  providerDashboardServiceData,
  providerDashboardRentItemData
} = require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.post("/providerDashboardServiceData", auth, isProvider, providerDashboardServiceData)
router.post("/providerDashboardRentItemData", auth, isProvider, providerDashboardRentItemData)


module.exports = router



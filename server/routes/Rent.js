// Import the required modules
const express = require("express")
const router = express.Router()

const {
  createRentItem,
  updateRentItem,
  cancelRentItem,
  getRentItemDetails,
  deleteRentItem,
  updateRentItemSlotProgress,
  getProviderRentItems,
  bookRentItem,
  //checkServiceStatus,
  //getAllServices,
  //getAllUsersOfService
} = require("../controllers/Rent")

const {
  createRentItemSlots,
  getSlotsOfRentItem,
  getRentItemSlotDetails,
  getRentItemsBookedByUser,
  //updateServiceSlots,
 // deleteServiceSlots,
} = require("../controllers/RentSlots")


// Importing Middlewares
const { auth, isUser, isProvider } = require("../middleware/Auth")

// ********************************************************************************************************
//                                      provider routes 
// ********************************************************************************************************

router.post("/createRentItem", auth, isProvider, createRentItem)
router.put("/updateRentItem", auth, isProvider, updateRentItem)
router.post("/getProviderRentItems",auth,isProvider,getProviderRentItems);
router.delete("/deleteRentItem", auth, isProvider, deleteRentItem)
router.post("/updateRentItemSlotProgress", auth, isProvider, updateRentItemSlotProgress)

//------------------------------unused------------------------------------------------------------
//router.get("/getAllUsersOfService", auth,getAllUsersOfService)


// ********************************************************************************************************
//                                      customer routes 
// ********************************************************************************************************
router.put("/bookRentItem",auth,isUser, bookRentItem)
router.post("/cancelRentItem", auth,isUser, cancelRentItem)
router.post("/getRentItemsBookedByUser", auth, isUser, getRentItemsBookedByUser)
router.post("/getRentItemDetails", getRentItemDetails)


//------------------------------unused------------------------------------------------------------
//router.get("/checkServiceStatus", auth,isUser, checkServiceStatus)
//router.get("/getAllServices", getAllServices)


// ********************************************************************************************************
//                                      slots routes 
// ********************************************************************************************************
router.post("/createRentItemSlots", auth, isProvider, createRentItemSlots)
router.post("/getSlotsOfRentItem", getSlotsOfRentItem)
router.post("/getRentItemSlotDetails", auth, isProvider,getRentItemSlotDetails)


//------------------------------unused------------------------------------------------------------
//router.put("/updateServiceSlots", auth, isProvider, updateRentItemSlots)
//router.delete("/deleteServiceSlots", auth, isProvider, deleteRentItemSlots)

module.exports = router
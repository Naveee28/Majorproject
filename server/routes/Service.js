// Import the required modules
const express = require("express")
const router = express.Router()

const {
  createService,
  updateService,
  cancelService,
  getServiceDetails,
  deleteService,
  updateServiceSlotProgress,
  getProviderServices,
  bookService,
  checkServiceStatus,
  getAllServices,
  getAllUsersOfService
} = require("../controllers/Service")

const {
  createServiceSlots,
  getSlotsOfServiceItem,
  getServiceSlotDetails,
  getServicesBookedByUser,
  updateServiceSlots,
  deleteServiceSlots,
} = require("../controllers/ServiceSlots")


// Importing Middlewares
const { auth, isUser, isProvider } = require("../middleware/Auth")

// ********************************************************************************************************
//                                      provider routes 
// ********************************************************************************************************

router.post("/createService", auth, isProvider, createService)
router.put("/updateService", auth, isProvider, updateService)
router.post("/getProviderServices",auth,isProvider,getProviderServices);
router.delete("/deleteService", auth, isProvider, deleteService)
router.post("/updateServiceSlotProgress", auth, isProvider, updateServiceSlotProgress)

//------------------------------unused------------------------------------------------------------
//router.get("/getAllUsersOfService", auth,getAllUsersOfService)


// ********************************************************************************************************
//                                      customer routes 
// ********************************************************************************************************
router.put("/bookService",auth,isUser, bookService)
router.post("/cancelService", auth,isUser, cancelService)
router.post("/getServicesBookedByUser", auth, isUser, getServicesBookedByUser)
router.post("/getServiceDetails", getServiceDetails)


//------------------------------unused------------------------------------------------------------
//router.get("/checkServiceStatus", auth,isUser, checkServiceStatus)
//router.get("/getAllServices", getAllServices)


// ********************************************************************************************************
//                                      slots routes 
// ********************************************************************************************************
router.post("/createServiceSlots", auth, isProvider, createServiceSlots)
router.post("/getSlotsOfService", getSlotsOfServiceItem)
router.post("/getServiceSlotDetails", auth, isProvider,getServiceSlotDetails)


//------------------------------unused------------------------------------------------------------
//router.put("/updateServiceSlots", auth, isProvider, updateServiceSlots)
//router.delete("/deleteServiceSlots", auth, isProvider, deleteServiceSlots)

module.exports = router
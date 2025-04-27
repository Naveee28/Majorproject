// Import the required modules
const express = require("express")
const router = express.Router()
const {
  capturePayment,
  // verifySignature,
  verifyPayment,
  sendPaymentSuccessEmail,
} = require("../controllers/payement");
const { auth, isUser, isProvider, isAdmin } = require("../middleware/Auth")
router.post("/capturePayment", auth, isUser, capturePayment)
router.post("/verifyPayment", auth, isUser, verifyPayment)
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isUser,
  sendPaymentSuccessEmail
)
module.exports = router

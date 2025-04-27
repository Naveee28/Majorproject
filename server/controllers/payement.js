const { instance } = require("../config/razorpay");
const Service = require("../models/Service");
const ServiceSlots = require("../models/ServiceSlots");
const RentSlots = require("../models/RentSlots");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/MailSender");
const { bookServiceLogic } = require("../controllers/Service");
const { bookRentLogic } = require("../controllers/Rent");
const mongoose = require("mongoose");

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  console.log("Backend Called ...");
  const { slotId, slotType } = req.body; // Expecting slotId and slotType in request body
  const userId = req.user.id;
  console.log("slot id :", slotId);
  if (!slotId || !slotType) {
      return res.json({ success: false, message: "Please Provide Slot ID and Slot Type" });
  }

  let total_amount = 0;
  let item; // This can be either a service or a rent item

  try {
      if (slotType === "service") {
          // Find the service slot by its ID and populate the service field
          const slot = await ServiceSlots.findById(slotId).populate("service");

          // If the slot is not found, return an error
          if (!slot) {
              return res.status(404).json({ success: false, message: "Service Slot not found" });
          }

          // Retrieve the service associated with the slot
          item = slot.service;

          // Check if the slot is already booked
          if (slot.slot.status === "booked") {
              return res
                  .status(400)
                  .json({ success: false, message: "Service Slot is already booked" });
          }
      } else if (slotType === "rent") {
          // Find the rent slot by its ID and populate the rent field
          const slot = await RentSlots.findById(slotId).populate("rent");

          // If the slot is not found, return an error
          if (!slot) {
              return res.status(404).json({ success: false, message: "Rent Slot not found" });
          }

          // Retrieve the rent item associated with the slot
          item = slot.rent;

          // Check if the slot is already booked
          if (slot.slot.status === "booked") {
              return res
                  .status(400)
                  .json({ success: false, message: "Rent Slot is already booked" });
          }
      } else {
          return res.status(400).json({ success: false, message: "Invalid slot type" });
      }

      // Add the price of the item to the total amount
      total_amount += item.price;

  } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
  }

  const options = {
      amount: total_amount * 100, // Amount in smallest currency unit
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
  };

  try {
      // Initiate the payment using Razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log(paymentResponse);

      // Send back the payment response along with itemId and slotType
      res.json({
          success: true,
          data: {
              ...paymentResponse,
              itemId: item._id, // Include itemId in the response
              slotType: slotType, // Include slotType in the response
          },
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Could not initiate order." });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, itemId, slotId, slotType } = req.body;
  
  // Ensure that req.user is populated by the auth middleware
  const userId = req.user ? req.user.id : null;  // The user ID is extracted from the token in the middleware
  
  // Log all incoming data to debug
  console.log("Data in verifyPayment:", { razorpay_order_id, razorpay_payment_id, razorpay_signature, itemId, slotId, slotType, userId });

  if (!userId) {
      console.log("User ID missing"); // Debugging
      return res.status(404).json({ success: false, message: "User not found" });
  }

  // Proceed with signature verification
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body).digest("hex");
  console.log("expectedSignature :" + expectedSignature);
  console.log("razorpay_signature:" + razorpay_signature);
  console.log("slottype :",slotType);
  // Compare Razorpay signature
  if (expectedSignature === razorpay_signature) {
      try {
          let bookingResult;
          if (slotType === "service") {
              // Call the function that handles service booking and pass the necessary data
              bookingResult = await bookServiceLogic(userId, itemId, slotId);  // Pass req to handle the booking logic
          } else if (slotType === "rent") {
              // Call the function that handles rent booking and pass the necessary data
              bookingResult = await bookRentLogic(userId, itemId, slotId);  // Pass req to handle the booking logic
          } else {
              return res.status(400).json({ success: false, message: "Invalid slot type" });
          }

          // Return success after booking is successful
          return res.status(200).json({
            success: true,
            message: "Payment Verified and Slot Booked",
            item: bookingResult.item,  // Return item details from the booking result
        });
      } catch (error) {
          console.error("Error booking slot:", error);
          return res.status(500).json({ success: false, message: error.message });  // Handle errors appropriately
      }
  }

  return res.status(400).json({ success: false, message: "Payment Failed" });
};

exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;
  
    // Validate required fields
    if (!orderId || !paymentId || !amount || !userId) {
      return res.status(400).json({ success: false, message: "Please provide all the details" });
    }
  
    try {
      // Find the user by userId
      const bookedUser = await User.findById(userId);
      if (!bookedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Send payment success email
      await mailSender(
        bookedUser.email,
        "Payment Received",
        "Slot booked successfully."
      );
  
      return res.status(200).json({ success: true, message: "Payment success email sent" });
    } catch (error) {
      console.log("Error in sending email:", error);
      return res.status(500).json({ success: false, message: "Could not send email" });
    }
};
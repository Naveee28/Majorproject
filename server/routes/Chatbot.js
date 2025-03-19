const express = require("express");
const router = express.Router();
const { handleChatbotQuery } = require("../controllers/Chatbot");
const { auth } = require("../middleware/Auth");

router.post("/query", auth, handleChatbotQuery);

module.exports = router;
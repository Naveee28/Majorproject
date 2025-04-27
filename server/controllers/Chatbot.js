const User = require("../models/User");
const Service = require("../models/Service");
const Rent = require("../models/Rent");
const Category = require("../models/Category");
const mailSender = require("../utils/MailSender");

exports.handleChatbotQuery = async (req, res) => {
    try {
        const { message, selectedServiceId, selectedRentId, contactNumber, issueDescription } = req.body;
        const userId = req.user.id; // Get the user ID from the authenticated user

        // Skip overcharge check if a service or rent is selected
        if (!selectedServiceId && !selectedRentId) {
            // Step 1: Check if the message contains overcharge-related keywords
            const overchargeKeywords = ["overcharged", "paid extra", "expensive"];
            const isOverchargeQuery = overchargeKeywords.some(keyword => message.toLowerCase().includes(keyword));

            if (isOverchargeQuery) {
                // Step 2: Fetch the user's latest top 5 booked services and rents
                const user = await User.findById(userId).populate("services").populate("rents");
                console.log("user slots :", user.services);
                console.log("user rents ",user.rents);
                const topServices = user.services.slice(-5); // Latest 5 services
                const topRents = user.rents.slice(-5); // Latest 5 rents

                return res.status(200).json({
                    success: true,
                    message: "Here are your latest top 5 booked services and rents:",
                    services: topServices,
                    rents: topRents,
                });
            }
        }

        // Step 4: Fetch the relevant admin for the selected service/rent
        if (selectedServiceId || selectedRentId) {
            let adminEmail = null;

            if (selectedServiceId) {
                // Fetch the service and its category
                const service = await Service.findById(selectedServiceId).populate("category");
                const category = await Category.findById(service.category).populate("admin");
                adminEmail = category.admin.email; // Admin who created the category
            } else if (selectedRentId) {
                // Fetch the rent and its category
                const rent = await Rent.findById(selectedRentId).populate("category");
                const category = await Category.findById(rent.category).populate("admin");
                adminEmail = category.admin.email; // Admin who created the category
            }

            if (!adminEmail) {
                return res.status(404).json({
                    success: false,
                    message: "Admin not found for the selected service/rent.",
                });
            }
            async function sendVerificationEmail(adminEmail, mailBody) {
                try {
                    const mailResponse = await mailSender(
                        adminEmail,
                        "Overcharge Issue",
                        mailBody
                    );
                    console.log("Email sent successfully: ", mailResponse.response);
                } catch (error) {
                    console.log("Error occurred while sending email: ", error);
                    throw error;
                }
            }
            // Step 7: Send email to the relevant admin
            if (contactNumber && issueDescription) {
                const mailBody = `Contact Number: ${contactNumber}\nIssue Description: ${issueDescription}`;
                await sendVerificationEmail(adminEmail, mailBody);
                return res.status(200).json({
                    success: true,
                    message: "Your issue has been submitted successfully!",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Please provide your contact number and describe the issue.",
            });
        }

        // Generic response for other queries
        return res.status(200).json({
            success: true,
            message: "How can I assist you today?",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
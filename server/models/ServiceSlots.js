const mongoose = require("mongoose");
const mailSender = require("../utils/MailSender");
const emailTemplate = require("../mail/templates/serviceStatusUpdate");
const initiatedEmailTemplate = require("../mail/templates/serviceInitiated")// Assuming you have a template for service status updates

const serviceSlotsSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "service",
    },
    slot: {
        startTime: { 
            type: String, 
            required: true, 
            match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, // 24-hour format
        },
        endTime: { 
            type: String, 
            required: true, 
            match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, // 24-hour format
        },
        bookedBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "user" 
        },
        status: {
            type: String,
            enum: ["available", "booked"],
            default: "available",
        },
        progress: {
            type: String,
            enum: ["Not Initiated", "Initiated", "InProgress", "Completed", "Cancelled"],
            default: "Not Initiated",
        },
    }
});

// Define a function to send emails based on service status
async function sendServiceStatusEmail(userEmail, service, newStatus, date, startTime, endTime) {
    try {
        console.log("--------------------------->mail sending<---------------------------")
        const mailResponse = await mailSender(
            userEmail,
            "Service Status Update",
            emailTemplate(service, newStatus, date, startTime, endTime)  // Assuming your template function accepts service and status
        );
        console.log("Email sent successfully: ", mailResponse.response);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}


// Define a function to send emails based on service status
async function sendServiceinitiatedEmail(userEmail, service, status,newStatus, date, startTime, endTime) {
    try {
        console.log("--------------------------->mail sending<---------------------------")
        const mailResponse = await mailSender(
            userEmail,
            "Service Initiated",
            initiatedEmailTemplate(service, status,newStatus, date, startTime, endTime)  // Assuming your template function accepts service and status
        );
        console.log("Email sent successfully: ", mailResponse.response);
    } catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}


// Define a pre-save hook to trigger email on status change
serviceSlotsSchema.pre("save", async function (next) {
    // Check if this is an update to an existing document
    if (!this.isNew) {
        // Check if the status or progress has changed
       
        const newStatus = this.slot.progress;
        const date = this.date.toLocaleDateString();  // Format date
        const startTime = this.slot.startTime;
        const endTime = this.slot.endTime;
        await this.populate("service");

        console.log("////////-->" ," --" ,newStatus);
        if (  newStatus == "Initiated") {
            const user = await mongoose.model("user").findById(this.slot.bookedBy); // Assuming you have a User model
            if (user && user.email) {
                await sendServiceinitiatedEmail(user.email, this.service, newStatus, date, startTime, endTime);
            }
        }
        else{
            const user = await mongoose.model("user").findById(this.slot.bookedBy); // Assuming you have a User model
            if (user && user.email) {
                await sendServiceStatusEmail(user.email, this.service, newStatus, date, startTime, endTime);
            }
        }
    }
    next();
});

module.exports = mongoose.model("ServiceSlots", serviceSlotsSchema);

import { useState } from "react";
import { IoSend } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { apiConnector } from "../../services/apiConnector";
import { endpoints } from "../../services/apis";
import { useSelector } from "react-redux";

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [issueDescription, setIssueDescription] = useState("");
    const [showContactForm, setShowContactForm] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedRent, setSelectedRent] = useState(null);
    const [topServices, setTopServices] = useState([]);
    const [topRents, setTopRents] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showContactNumberInput, setShowContactNumberInput] = useState(false);
    const [showIssueDescriptionInput, setShowIssueDescriptionInput] = useState(false);
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);

    const sendMessage = async () => {
        if (!input.trim()) return;
        setMessages([...messages, { text: input, sender: "user" }]);
        setInput("");

        try {
            console.log("token :",token);
            console.log("url :",endpoints.CHATBOT_QUERY_API);
            const response = await apiConnector(
                "POST",
                `${endpoints.CHATBOT_QUERY_API}`,
                {
                    message: input,
                    userId: user._id,
                },
                {
                    Authorization: `Bearer ${token}`,
                }
            );

            if (response.data.success) {
                console.log("response data :", response.data);
                if (response.data.services && response.data.rents) {
                    setTopServices(response.data.services);
                    setTopRents(response.data.rents);
                    setMessages((prev) => [
                        ...prev,
                        { text: "Here are your latest top 5 booked services and rents:", sender: "bot" },
                    ]);

                    // Show dropdown for selection
                    setShowDropdown(true);
                } else {
                    setMessages((prev) => [
                        ...prev,
                        { text: response.data.message, sender: "bot" },
                    ]);
                }
            }
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { text: "An error occurred. Please try again.", sender: "bot" },
            ]);
        }
    };

    const handleSelectService = (serviceId) => {
        const selectedService = topServices.find((service) => service._id === serviceId);
        setSelectedService(selectedService);
        setMessages((prev) => [
            ...prev,
            { text: `Selected Service: ${selectedService.name} - $${selectedService.price}`, sender: "user" },
            { text: "Please enter your contact number.", sender: "bot" },
        ]);
        setShowDropdown(false);
        setShowContactNumberInput(true); // Show contact number input
    };
    
    const handleSelectRent = (rentId) => {
        const selectedRent = topRents.find((rent) => rent._id === rentId);
        setSelectedRent(selectedRent);
        setMessages((prev) => [
            ...prev,
            { text: `Selected Rent: ${selectedRent.name} - $${selectedRent.price}`, sender: "user" },
            { text: "Please enter your contact number.", sender: "bot" },
        ]);
        setShowDropdown(false);
        setShowContactNumberInput(true); // Show contact number input
    };

    const handleContactNumberSubmit = () => {
        if (!contactNumber.trim()) {
            setMessages((prev) => [
                ...prev,
                { text: "Please provide a valid contact number.", sender: "bot" },
            ]);
            return;
        }
    
        // Validate contact number (basic validation)
        if (!/^\d{10}$/.test(contactNumber)) {
            setMessages((prev) => [
                ...prev,
                { text: "Please enter a valid 10-digit contact number.", sender: "bot" },
            ]);
            return;
        }
    
        // Hide contact number input and show issue description input
        setShowContactNumberInput(false);
        setShowIssueDescriptionInput(true);
        setMessages((prev) => [
            ...prev,
            { text: contactNumber, sender: "user" },
            { text: "Please describe your issue.", sender: "bot" },
        ]);
    };

    const handleSubmitIssue = async () => {
        if (!issueDescription.trim()) {
            setMessages((prev) => [
                ...prev,
                { text: "Please provide a description of the issue.", sender: "bot" },
            ]);
            return;
        }
    
        // Add the user's issue description as a user message
        setMessages((prev) => [
            ...prev,
            { text: issueDescription, sender: "user" },
        ]);
    
        try {
            const response = await apiConnector("POST",
                endpoints.CHATBOT_QUERY_API,
            {
                selectedServiceId: selectedService?._id,
                selectedRentId: selectedRent?._id,
                contactNumber,
                issueDescription,
                userId: user._id,
            },
            {
                Authorization: `Bearer ${token}`,
            });
    
            if (response.data.success) {
                setMessages((prev) => [
                    ...prev,
                    { text: "Your issue has been submitted successfully!", sender: "bot" },
                ]);
                setShowIssueDescriptionInput(false);
                setContactNumber("");
                setIssueDescription("");
            }
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { text: "Failed to submit issue. Please try again.", sender: "bot" },
            ]);
        }
    };

    return (
        <>
            {/* Chat Icon */}
            <motion.div
                className="fixed bottom-6 right-6 bg-[#FDE047] p-3 rounded-full shadow-xl cursor-pointer z-50"
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <FaRobot className="text-black text-2xl" />
            </motion.div>

            {/* Chat Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setIsOpen(false)}
                        ></motion.div>

                        {/* Chat Pane */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="fixed bottom-0 right-0 w-full sm:w-96 h-full sm:h-[80vh] bg-white border-4 border-white shadow-lg flex flex-col rounded-t-3xl sm:rounded-3xl z-50 overflow-hidden"
                        >
                            {/* Rectangle Header */}
                            <div className="bg-black text-white p-4 font-semibold flex justify-between items-center shadow-md">
                                <span className="text-lg flex items-center gap-2">
                                    <FaRobot className="text-[#FDE047] text-2xl" /> Chatbot
                                </span>
                                <button className="text-white text-2xl" onClick={() => setIsOpen(false)}>
                                    ✖
                                </button>
                            </div>

                            {/* Messages Section */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`flex ${
                                            msg.sender === "user" ? "justify-end" : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`p-3 max-w-[70%] text-sm rounded-2xl shadow-md ${
                                                msg.sender === "user"
                                                    ? "bg-[#FDE047] text-black rounded-tr-none"
                                                    : "bg-black text-white rounded-tl-none"
                                            }`}
                                        >
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Dropdown for selecting services/rents */}
                                {showDropdown && (
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-lg font-semibold">Select a Service or Rent:</h3>
                                        <select
                                            className="p-2 border rounded-lg"
                                            onChange={(e) => {
                                                const selectedId = e.target.value;
                                                if (selectedId.startsWith("service-")) {
                                                    handleSelectService(selectedId.replace("service-", ""));
                                                } else if (selectedId.startsWith("rent-")) {
                                                    handleSelectRent(selectedId.replace("rent-", ""));
                                                }
                                            }}
                                        >
                                            <option value="">Select an option</option>
                                            {topServices.map((service) => (
                                                <option key={`service-${service._id}`} value={`service-${service._id}`}>
                                                    Service: {service.name} - ${service.price}
                                                </option>
                                            ))}
                                            {topRents.map((rent) => (
                                                <option key={`rent-${rent._id}`} value={`rent-${rent._id}`}>
                                                    Rent: {rent.name} - ${rent.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Contact Number Input */}
                                {showContactNumberInput && (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="text"
                                            value={contactNumber}
                                            onChange={(e) => setContactNumber(e.target.value)}
                                            className="p-2 border rounded-lg"
                                            placeholder="Enter your contact number"
                                        />
                                        <button
                                            onClick={handleContactNumberSubmit}
                                            className="bg-[#FDE047] text-black p-2 rounded-lg"
                                        >
                                            Submit Contact Number
                                        </button>
                                    </div>
                                )}

                                {/* Issue Description Input */}
                                {showIssueDescriptionInput && (
                                    <div className="flex flex-col gap-2">
                                        <textarea
                                            value={issueDescription}
                                            onChange={(e) => setIssueDescription(e.target.value)}
                                            className="p-2 border rounded-lg"
                                            placeholder="Describe your issue"
                                        />
                                        <button
                                            onClick={handleSubmitIssue}
                                            className="bg-[#FDE047] text-black p-2 rounded-lg"
                                        >
                                            Submit Issue
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Input Box */}
                            <div className="p-3 border-t flex items-center bg-white rounded-b-3xl shadow-lg">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-1 p-3 border rounded-l-2xl outline-none text-black"
                                    placeholder="Type a message..."
                                />
                                <button
                                    onClick={sendMessage}
                                    className="bg-[#FDE047] text-black p-3 rounded-r-2xl shadow-md"
                                >
                                    <IoSend className="text-xl" />
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import ServiceDetailsCard from "../components/core/Service/ServiceDetailsCard";
import SlotCard from "./../components/core/Service/ServiceSlotCard";
import { fetchServiceSlots, bookServiceSlots } from "../services/operations/serviceDetailsAPI";
import { useNavigate, useParams } from "react-router-dom";
import { ACCOUNT_TYPE } from "../utils/constants";
import { toast } from "react-hot-toast";
import { fetchServiceDetails } from "../services/operations/serviceDetailsAPI";
import { setService } from "../slices/serviceSlice";

const ServiceBook = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { service } = useSelector((state) => state.service);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serviceId } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchServiceDetails(serviceId);
        dispatch(setService(res));
      } catch (error) {
        console.log("Could not fetch Service Details", error);
      }
    })();
  }, [serviceId, dispatch]);

  const fetchSlots = async () => {
    if (!service?._id) return;
    setLoading(true);
    try {
      const res = await fetchServiceSlots(service._id, selectedDate);
      const availableSlots = res.filter((slot) => slot.slot.status === "available");
      setSlots(availableSlots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
    setLoading(false);
    setSelectedSlot(null);
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate, service?._id]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (slotId, startTime, endTime) => {
    setSelectedSlot({ slotId, startTime, endTime });
  };

  const handleBookSlot = async () => {
    // if (!token) {
    //   setConfirmationModal({
    //     text1: "Are You Sure !",
    //     text2: " Continue Booking.",
    //     btn1Text: "Continue",
    //     btn2Text: "Cancel",
    //     btn1Handler: () => navigate("/login"),
    //     btn2Handler: () => setConfirmationModal(null),
    //   });
    //   return;
    // }

    if (user?.accountType === ACCOUNT_TYPE.PROVIDER) {
      toast.error("You are a Provider. You can't book a service.");
      return;
    }

    if (selectedSlot) {
      try {
        setLoading(true);
        const payload = {
          userId: user._id,
          slotId: selectedSlot.slotId,
          serviceId: service._id,
        };
        const res = await bookServiceSlots(payload, token);
        setLoading(false);
        toast.success( "Booking successful!") ;
        fetchSlots();
      } catch (error) {
        setLoading(false);
        console.error("Booking failed:" , error);
        toast.error("Fetching slot details failed. Please try again");
      }
    }
  };

  if (!service) {
    return <div>Loading service details...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 m-7">
      <div className="w-full md:w-1/3">
        <ServiceDetailsCard />
      </div>
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
        <div className="bg-gray-100 p-4 rounded-md text-gray-800 shadow-md mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Date</h2>
          <Calendar onChange={handleDateChange} value={selectedDate} className="" />
        </div>
        {selectedSlot && (
          <div className="bg-gray-100 p-4 rounded-md text-white text-center shadow-md w-2/3 mt-4">
            <h2 className="text-xl font-semibold text-white mb-4">Selected Slot</h2>
            <p>Date: {selectedDate.toDateString()}</p>
            <p>Start Time: {selectedSlot.startTime}</p>
            <p>End Time: {selectedSlot.endTime}</p>
            <div className="flex flex-col gap-4 mt-5">
              <button className="yellowButton" onClick={handleBookSlot}>
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="w-full md:w-1/3 flex items-center justify-center">
        <SlotCard slots={slots} loading={loading} handleSlotSelect={handleSlotSelect} />
      </div>
    </div>
  );
};

export default ServiceBook;

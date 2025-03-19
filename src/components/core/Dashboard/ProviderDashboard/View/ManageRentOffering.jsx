import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import RentItemDetailsCard from "../../../Rentals/RentItemDetailsCard";
import SlotCard from "../../../Rentals/RentItemSlotCard";
import { fetchRentItemSlots, updateRentItemSlotProgress } from "../../../../../services/operations/rentDetailsAPI";
import { useNavigate, useParams } from "react-router-dom";
import { ACCOUNT_TYPE } from "../../../../../utils/constants";
import { toast } from "react-hot-toast";
import { fetchRentItemDetails } from "../../../../../services/operations/rentDetailsAPI";
import { setRent } from "../../../../../slices/rentSlice";

const ManageRentOffering = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { rent } = useSelector((state) => state.rent);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedProgress, setSelectedProgress] = useState("Accepted");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rentId } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchRentItemDetails(rentId);
        dispatch(setRent(res));
      } catch (error) {
        console.log("Could not fetch Rent Details", error);
      }
    })();
  }, [rentId, dispatch]);

  const fetchSlots = async () => {
    if (!rent?._id) return;
    setLoading(true);
    try {
      const res = await fetchRentItemSlots(rent._id, selectedDate);
      const availableSlots = res.filter((slot) => slot.slot.status === "booked" && slot.slot.progress !== "Completed");
      setSlots(availableSlots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
    setLoading(false);
    setSelectedSlot(null);
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate, rent?._id]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = (slotId, startTime, endTime, bookedBy) => {
    setSelectedSlot({ slotId, startTime, endTime, bookedBy });
  };

  const handleChangeProgress = async () => {
    if (selectedSlot) {
      try {
        setLoading(true);
        const payload = {
          progress: selectedProgress,
          slotId: selectedSlot.slotId,
          rentItemId: rent._id,
        };
        const res = await updateRentItemSlotProgress(payload, token);
        setLoading(false);
        //toast.success("Slot progress updated successfully");
        fetchSlots(); // Refresh slots after updating progress
      } catch (error) {
        setLoading(false);
        console.error("Updating slot progress failed:", error);
        toast.error("Updating slot progress failed. Please try again.");
      }
    }
  };

  if (!rent) {
    return <div>Loading rent details...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
      <div className="w-full md:w-1/3">
        <RentItemDetailsCard />
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
            <p>Booked By: {selectedSlot.bookedBy}</p>
            <div className="flex flex-col gap-4 mt-5">
              <label htmlFor="progress" className="text-sm font-medium text-gray-800">
               Select Progress:
              </label>
              <select
                id="progress"
                value={selectedProgress}
                onChange={(e) => setSelectedProgress(e.target.value)}
                className="p-2 border rounded-md text-[#000000]"
              >
                <option value="Accepted">InProgress</option>
                <option value="Completed">Completed</option>
              </select>
              <button className="yellowButton" onClick={handleChangeProgress} disabled={loading}>
                {loading ? "Updating..." : "Update Progress"}
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

export default ManageRentOffering;

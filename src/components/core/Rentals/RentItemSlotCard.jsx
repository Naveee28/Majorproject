import React from "react";

const SlotCard = ({ slots, loading, handleSlotSelect }) => {
  console.log(slots);
  if (loading) {
    return <p>Loading slots...</p>;
  }

  return (
    <div className="bg-richblack-700 p-4 rounded-md text-richblack-5 w-full">
      <h2 className="text-xl font-semibold mb-4 text-center bg-yellow-500">
        Available Slots
      </h2>
      {slots?.length === 0 ? (
        <p>No available slots for this date.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          {slots.map((slot) => (
            <button
              key={slot._id}
              className={"w-full py-2 my-2 rounded bg-gray-400 hover:bg-gray-500"}
              onClick={() =>
                handleSlotSelect(
                  slot._id,
                  slot.slot.startTime,
                  slot.slot.endTime
                )
              }
            >
              {slot.slot.startTime} - {slot.slot.endTime}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlotCard;
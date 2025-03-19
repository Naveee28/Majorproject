import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { deleteSlot } from '../../../../../../../services/operations/serviceDetailsAPI';
import { setService } from '../../../../../../../slices/serviceSlice';
import ConfirmationModal from '../../../../../../Common/ConfirmationModal';

export default function NestedView({ slots = [] }) {
  const { service } = useSelector((state) => state.service);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [confirmationModal, setConfirmationModal] = useState(null);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Adjust the format as needed
  };

//   const handleDeleteSlot = async (slotId) => {
//     const result = await deleteSlot({ slotId, serviceId: service._id, token });
//     if (result) {
//       dispatch(setService(result));
//     }
//     setConfirmationModal(null);
//   };

  return (
    <>
      <div className="rounded-lg bg-richblack-700 p-6 px-8">
        {service.slots.map((slot) => (
          <div key={slot._id} className="flex justify-between items-center border-b-2 border-b-richblack-600 py-2">
            <div>
              <p className="text-richblack-50"> Date: {formatDate(slot.date)}</p>
              <p className="text-richblack-50">Start Time: {slot.slot.startTime}</p>
              <p className="text-richblack-50">End Time: {slot.slot.endTime}</p>
            </div>
            {/* <button
              onClick={() =>
                setConfirmationModal({
                  text1: 'Delete this Slot?',
                  text2: 'This slot will be deleted permanently.',
                  btn1Text: 'Delete',
                  btn2Text: 'Cancel',
                  btn1Handler: () => handleDeleteSlot(slot._id),
                  btn2Handler: () => setConfirmationModal(null),
                })
              }
            >
              <RiDeleteBin6Line className="text-xl text-richblack-300" />
            </button> */}
          </div>
        ))}
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

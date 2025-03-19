const RentItem = require("../models/Rent");
const RentItemSlots = require("../models/RentSlots");
const User = require("../models/User")


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.getRentItemsBookedByUser = async (req, res) => {
    const { userId } = req.body;
    
    // Validate incoming data
    if (!userId) {
        return res.status(400).json({ message: 'UserId is required' });
    }

    try {
        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find all service slots booked by the user
        const bookedSlots = await RentItemSlots.find({ "slot.bookedBy": userId })
            .populate('rent')
            .populate('slot.bookedBy');

        // If no slots are found
        if (!bookedSlots.length) {
            return res.status(404).json({ message: 'No booked services found for this user' });
        }

        // Return the booked slots data
        return res.status(200).json({ success: true, data: bookedSlots });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////

exports.createRentItemSlots = async (req, res) => {
    try {
        const { startDate, endDate, rentItemId, startTime, endTime } = req.body;

        // Validate incoming data
        if (!startDate || !endDate || !rentItemId || !startTime || !endTime) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        console.log('Request Data:', { startDate, endDate, rentItemId, startTime, endTime });

        // Find the corresponding service item
        let rentItem = await RentItem.findById(rentItemId);
        if (!rentItem) {
            return res.status(404).json({ message: 'Rent Item  not found' });
        }

        console.log('Rent Item Found:', rentItem);

        // Initialize slot count
        let slotCount = 0;

        // Create slots for each date between startDate and endDate
        let currentDate = new Date(startDate);
        const end = new Date(endDate);
        while (currentDate <= end) {
            // Create new service slot
            const newRentItemSlot = new RentItemSlots({
                date: currentDate,
                rent: rentItemId,
                slot: {
                    startTime,
                    endTime,
                },
            });

            console.log('New rentItem Slot:', newRentItemSlot);
            // Save the service slot to the database
            await newRentItemSlot.save();

            // Add the service slot to the service item's slots array
            rentItem.slots.push(newRentItemSlot._id);

            // Increment slot count
            slotCount++;

            // Move to the next date
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Save the updated service item
        await rentItem.save();
        console.log('rent Item Item Updated:', rentItem);

        // Populate the service item with all fields
        rentItem = await RentItem.findById(rentItemId)
            .populate('provider')
            .populate('ratingAndReviews')
            .populate('category')
            .populate('slots');

        console.log('Populated rent Item :', rentItem);

        return res.status(201).json({ 
            message: 'rent Item slots created successfully',
            slotCount,
            dateRange: { startDate, endDate },
            timeRange: { startTime, endTime },
            rentItem: rentItem
        });
    } catch (error) {
        console.error('Error in createRentItemSlots:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.getSlotsOfRentItem = async (req, res) => {
    try {
        const { rentItemId, date } = req.body;

        // Validate incoming data
        if (!rentItemId || !date) {
            return res.status(400).json({ message: 'Service ID and date are required' });
        }

        console.log(rentItemId, date);

        // Parse the date
        const selectedDate = new Date(date);

        // Extract year, month, and day from the selected date
        const selectedYear = selectedDate.getUTCFullYear();
        const selectedMonth = selectedDate.getUTCMonth() + 1; // Months are zero-indexed
        const selectedDay = selectedDate.getUTCDate()+1;
        
         console.log(selectedDay," ",selectedMonth," ",selectedYear);
        // Find all service slots for the specified service item and date
        const rentItemSlots = await RentItemSlots.find({
            rent: rentItemId,
            $expr: {
                $and: [
                    { $eq: [{ $year: '$date' }, selectedYear] },
                    { $eq: [{ $month: '$date' }, selectedMonth] },
                    { $eq: [{ $dayOfMonth: '$date' }, selectedDay] },
                ],
            },
        }).populate('rent').populate('slot.bookedBy');
        console.log(rentItemSlots);
        return res.status(200).json({ success: true, data: rentItemSlots });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.getRentItemSlotDetails = async (req,res) => {
    try {
        const { rentItemId, slotId } = req.body;

        // Validate incoming data
        if (!rentItemId || !slotId) {
            return res.status(400).json({ message: 'Service ID and slotId are required' });
        }

        console.log(rentItemId, slotId);

        const rentItemSlot = await RentItemSlots.find({
            rent: rentItemId,
            slot:slotId
        }).populate('rent').populate('slot.bookedBy');
        console.log(rentItemSlot);
        return res.status(200).json({ success: true, data: rentItemSlot });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

};

// /////////////////////////////////////////////////////////////-------UNUSED--------////////////////////////////////////////////////////////
// exports.updateServiceSlots = async (req, res) => {
//     try {
//         const { id } = req.params; // Use slotId from request params
//         const { newStartTime, newEndTime } = req.body;

//         // Find the corresponding service slot
//         const serviceSlot = await ServiceSlots.findById(id);
//         if (!serviceSlot) {
//             return res.status(404).json({ message: 'Service slot not found' });
//         }

//         // Update the service slot with the new start time and end time
//         serviceSlot.slot.startTime = newStartTime;
//         serviceSlot.slot.endTime = newEndTime;
//         await serviceSlot.save();

//         return res.status(200).json({ message: 'Service slot updated successfully' });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// };
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// exports.deleteServiceSlots = async (req, res) => {
//     console.log("Entered ");
//     try {
//         const { id } = req.params; // Use slotId from request params

//         // Find the corresponding service slot
//         const serviceSlot = await ServiceSlots.findById(id);
//         if (!serviceSlot) {
//             return res.status(404).json({ message: 'Service slot not found' });
//         }

//         // Find the corresponding service item
//         const serviceItem = await Service.findById(serviceSlot.service);
//         if (!serviceItem) {
//             return res.status(404).json({ message: 'Service item not found' });
//         }

//         // Remove the service slot from the database
//         await ServiceSlots.findByIdAndDelete(id);

//         // Remove the reference to the deleted service slot from the service item's slots array
//         serviceItem.slots = serviceItem.slots.filter(slot => !slot.equals(id));

//         // Save the updated service item
//         await serviceItem.save();

//         return res.status(200).json({ message: 'Service slot deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

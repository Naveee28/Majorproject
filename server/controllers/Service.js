const Service = require('../models/Service');
const User = require('../models/User');
const Category = require('../models/Category');
//const ServiceProgress= require('../models/ServiceProgress');
const Slot=require('../models/ServiceSlots');
const RatingAndReview= require('../models/RatingAndReviews');
const { uploadImageToCloudinary }= require('../utils/ImageUploder');

/////////////////////////////////////////////////////////////////////////////////////////////

exports.createService = async (req, res) => {

    try {

        const userId = req.user.id; 

        const { name,
               description,
               whatYouWillLearn, 
               instructions: _instructions,
               location, 
               price, 
               category 
            } = req.body;
    // Convert the tag and instructions from stringified Array to Array
 
    const instructions = JSON.parse(_instructions)

    
    console.log("instructions", instructions)
        let thumbnailUrl = "";
        const thumbnail = req.files.thumbnailImage;

        console.log(userId);
        console.log(name);
        console.log(description);
        console.log(location);
        console.log(price);
        console.log(category);
          // Log received data for debugging
          console.log("Received data:", req.body);
          console.log("Received files:", req.files);

        if (!name || !description || !location || !price || !category || !whatYouWillLearn || !instructions.length ) {
            return res.status(400).json({
                success: false,
                message: 'All required fields are not provided.',
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        if (req.files && req.files.thumbnailImage) {
            console.log("File details:", req.files.thumbnailImage); // Debugging line
            if (!thumbnail.tempFilePath) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file upload.',
                });
            }
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            );
            console.log(thumbnailImage);
            thumbnailUrl = thumbnailImage.secure_url;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Thumbnail image is required.',
            });
        }

        const service = await Service.create({
            name,
            description,
            provider: userId,
            location,
            ratingAndReviews: [],
            price,
            thumbnail: thumbnailUrl,
            category,
            slots: [],
            whatYouWillLearn: whatYouWillLearn,
            instructions
        });

        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { services: service._id } },
            { new: true }
        );

        await Category.findByIdAndUpdate(
            category,
            { $push: { services: service._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            service,
            message: 'Service created successfully.',
        });
    } catch (error) {
        console.error(error);
        console.error("Error details:", error);
        return res.status(500).json({
            success: false,
            message: 'Service creation failed. Please try again.',
        });
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////

exports.updateService = async (req, res) => {
    try {
        const { serviceId } = req.body; // Get the service ID from request body
        const updateFields = req.body; // Get the update fields from request body

        // Check if the service exists
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        // Check if user is trying to edit serviceProvider or ratingAndReviews
        if ('serviceProvider' in updateFields || 'ratingAndReviews' in updateFields) {
            return res.status(400).json({
                success: false,
                message: 'You are not allowed to edit the "serviceProvider" or "ratingAndReviews" fields',
            });
        }

        // Handle thumbnail image update
        if (req.files && req.files.thumbnailImage) {
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            );
            service.thumbnail = thumbnailImage.secure_url;
        }

        // Update the service fields
        for (const field of Object.keys(updateFields)) {
            if (field === 'category') {
                // Remove the service ID from the previous category's services array
                await Category.findByIdAndUpdate(service.category, { $pull: { services: serviceId } });

                // Update the service's category
                service.category = updateFields[field];

                // Add the service ID to the new category's services array
                await Category.findByIdAndUpdate(updateFields[field], { $push: { services: serviceId } });
            } else if (field === 'slots') {
                // Append the new slots array to the existing array
                service.slots = service.slots.concat(updateFields[field]);
            } else {
                service[field] = updateFields[field];
            }
        }

        await service.save();
        
        const service1 = await Service.findById(serviceId)
        .populate({
            path: 'provider',
            select: 'firstName lastName email contactNumber',
        })
        .populate({
            path: 'category',
            select: 'name description',
        })
        .populate({
            path: 'ratingAndReviews',
            select: 'user rating review',
            populate: {
                path: 'user',
                select: 'firstName lastName email',
            },
        })
        
        .populate({
            path: 'slots',
            select: 'date slot',
            populate: {
                path: 'slot.bookedBy',
                select: 'firstName lastName email',
            },
        })
        .exec();
        
        return res.status(200).json({
            success: true,
            service1,
            message: 'Service updated successfully',
        });
    } catch (error) {
        console.error('Error updating service:', error);
        return res.status(500).json({
            success: false,
            message: 'Service update failed. Please try again.',
        });
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////

// Get a list of Course for a given Instructor
exports.getProviderServices = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const {userId} = req.body;
  
      // Find all courses belonging to the instructor
      const providerServices = await Service.find({
        provider : userId,
      }).sort({ since: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: providerServices,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve provider Services ",
        error: error.message,
      })
    }
  }


/////////////////////////////////////////////////////////////////////////////////////////////
exports.getAllServices = async (req, res) => {
    try {
        // Find all rent items and populate all fields of reference
        const services = await Service.find({})
            .populate({
                path: 'serviceProvider',
                select: 'firstName lastName email contactNumber',
            })
            .populate({
                path: 'category',
                select: 'name description',
            })
            .populate({
                path: 'ratingAndReviews',
                select: 'user rating review',
                populate: {
                    path: 'user',
                    select: 'firstName lastName email',
                },
            })
            .populate({
                path: 'slots',
                select: 'date slot',
                populate: {
                    path: 'slot.bookedBy',
                    select: 'firstName lastName email',
                },
            })
            .exec();

        return res.status(200).json({
            success: true,
            data: services,
            message: 'All services retrieved successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve services. Please try again.',
        });
    }
};

///////////////////////////////////////////////////////////////////////////////////////////////////

exports.deleteService = async (req, res) => {
    try {
        const { serviceId } = req.body;
         // Get the service ID from params
        // Find the service by ID
        console.log("service id backend :",serviceId);
        const service = await Service.findById(serviceId);
        console.log("service :",service);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }
        // Delete all slots associated with the service
        await Slot.deleteMany({ 'service': serviceId });

        // Remove the service ID from the user's services array
        await User.updateMany({}, { $pull: { services: serviceId } });

        // Remove the service ID from the category's services array
        await Category.updateMany({}, { $pull: { services: serviceId } });

        // Delete all rating and reviews associated with the service
        await RatingAndReview.deleteMany({ 'ID': serviceId });

        // Delete the service
        await Service.findByIdAndDelete(serviceId);

        return res.status(200).json({
            success: true,
            message: 'Service deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Service deletion failed. Please try again.',
        });
    }
};



//////////////////////////////////////////////////////////////////////////////////////////////////

exports.updateServiceSlotProgress = async (req, res) => {
  try {
    const { progress, slotId, serviceId } = req.body;

    // Find the service slot by serviceId and slotId
    const serviceSlot = await Slot.findOne({ _id: slotId, service: serviceId });
    
    if (!serviceSlot) {
      return res.status(404).json({ success: false, message: "Service slot not found" });
    }

    // Update the progress field
    serviceSlot.slot.progress = progress;
    await serviceSlot.save();

    // Return the updated service slot
    return res.status(200).json({
      success: true,
      data: serviceSlot,
      message: 'Service slot progress updated successfully'
    });
  } catch (error) {
    console.error("Error updating service slot progress:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////


exports.bookService = async (req, res) => {
    try {
      const { serviceId, slotId ,userId} = req.body;
 
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the service exists
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ success: false, message: "Service not found" });
      }
  
      // Check if the slot exists and is available
      const result = await Slot.findById(slotId);
      if (!result) {
        return res.status(400).json({ success: false, message: "Slot not found" });
      }
      if (result.slot.status !== "available") {
        return res.status(400).json({ success: false, message: "Slot not available" });
      }
  
      // Update slot status to booked and assign bookedBy
      result.slot.status = "booked";
      result.slot.progress ="Initiated";
      result.slot.bookedBy = userId;
      await result.save();
      
      console.log("slot after update :",result);
  
      return res.status(200).json({ success: true, message: "Service booked successfully", service });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
///////////////////////////////////////////////////////////////////////////////////////////////////


// 9. Cancel service 
exports.cancelService = async (req, res) => {
    try {
  
      const { serviceId ,slotId,userId } = req.body; // Assuming the service ID is sent in the request body
  
      console.log("user :",userId);
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      // Check if the service exists
      const service = await Service.findById(serviceId).populate('slots');
      if (!service) {
          return res.status(404).json({ message: 'Service not found' });
      }
    
    // Check if the particular slot of the service is booked by the current user
    const result = service.slots.find(slot => slot._id.toString() === slotId);
    if (!result || result.slot.bookedBy.toString() !== userId) {
        return res.status(400).json({ message: 'Slot not booked by current user' });
    }
    
      // Update the slot status to available in the rent item
      result.slot.status = 'available';
      result.slot.progress="Not Intiated"
      result.slot.bookedBy= null;
   
      // Save the updated rent item, user, and rent progress
      await result.save();
      await user.save();
      
  
      return res.status(200).json({ message: 'Service cancelled successfully', service });
    } catch (error) {
      console.error("Error cancelling service:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  

  
//////////////////////////////////////////////////////////////////////////////////////////

exports.getServiceDetails = async (req, res) => {
    try {
        const { serviceId } = req.body;  // Get the service ID from params

        // Find the service by ID
        console.log(serviceId)
        const result = await Service.findById(serviceId);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }
        // Find the service by ID and populate all reference fields
        const service = await Service.findById(serviceId)
        .populate({
            path: 'provider',
            select: 'firstName lastName email contactNumber',
        })
        .populate({
            path: 'category',
            select: 'name description',
        })
        .populate({
            path: 'ratingAndReviews',
            select: 'user rating review',
            populate: {
                path: 'user',
                select: 'firstName lastName email',
            },
        })
        
        .populate({
            path: 'slots',
            select: 'date slot',
            populate: {
                path: 'slot.bookedBy',
                select: 'firstName lastName email',
            },
        })
        .exec();

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        return res.status(200).json({
            success: true,
            service,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch service. Please try again.',
        });
    }
};

//////////////////////////////////////////////----UNUSED---////////////////////////////////////////////////////////////////

// exports.checkServiceStatus = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming you have middleware to extract user ID from the request
//     const { serviceId , slotId} = req.body; // Assuming the service ID is sent in the request body

//     console.log(userId," ",serviceId," ",slotId);
//     // Find the service progress document for the user and service
//     const serviceProgress = await ServiceProgress.findOne({ serviceID:serviceId, userId,  slotId });

//     if (!serviceProgress) {
//       return res.status(404).json({ success: false, message: "Service progress not found" });
//     }

//     // Return the status information
//     return res.status(200).json({
//       success: true,
//       data: serviceProgress.orderinfo,
//     });
//   } catch (error) {
//     console.error("Error checking service status:", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// /////////////////////////////////////////////////////////////////////////////////////////////////


// exports.getAllUsersOfService = async (req, res) => {
//     const { serviceId } = req.params;

//     try {
//         // Find the service
//         const service = await Service.findById(serviceId);
//         if (!service) {
//             return res.status(404).json({ message: 'Service not found' });
//         }

//         // Populate users for each slot
//         await Service.populate(service, {
//             path: 'slots',
//             populate: {
//                 path: 'slot.bookedBy',
//                 model: 'user',
//                 select: 'firstName lastName email contactNumber'
//             }
//         });

//         // Extract unique user information from each slot
//         const usersMap = new Map();
//         service.slots.forEach(slot => {
//                 if (slot.slot.bookedBy) {
//                     usersMap.set(slot.slot.bookedBy._id.toString(), slot.slot.bookedBy);
//                 }

//         });
//         const users = Array.from(usersMap.values());

//         return res.status(200).json({ users });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

//////////////////////////////////////////////////////////////////////////////////////////////////
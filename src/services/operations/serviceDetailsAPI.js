import { toast } from "react-hot-toast"

import { updateCompletedLectures } from "../../slices/viewCourseSlice"
// import { setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector"
import { providerService , ServiceSlots , userService,ratingAndReviewEndpoints } from "../apis"

const {
    CREATE_SERVICE,
    UPDATE_SERVICE,
    GET_ALL_USERS_OF_SERVICE,
    GET_PROVIDER_SERVICES,
    DELETE_SERVICE,
    UPDATE_SERVICE_PROGRESS,
} =  providerService;

const{
    CREATE_SERVICE_SLOTS,
    UPDATE_SERVICE_SLOTS,
    DELETE_SERVICE_SLOTS,
    GET_SLOTS_OF_SERVICE,
    GET_SERVICE_SLOT_DETAILS,
    
} = ServiceSlots;
   
 const {
    BOOK_SERVICE,
    CANCEL_SERVICE,
    CHECK_SERVICE_STATUS,
    GET_ALL_BOOKED_SERVICES,
    GET_ALL_SERVICES,
    GET_SERVICE_DETAILS,   
 } = userService;

 const {
  CREATE_RATING_API,
  FETCH_SERVICE_REVIEWS,
  FETCH_RENT_REVIEWS
 }=ratingAndReviewEndpoints;

//////////////////////////////////////////////////////////////

// add the course details
export const addServiceDetails = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", CREATE_SERVICE, data, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      })
      console.log("CREATE SERVICE API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Add Service Details")
      }
      toast.success("Service Details Added Successfully")
      result = response?.data?.service
    } catch (error) {
      console.log("CREATE SERVICE API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }

///////////////////////////////////////////////////////////

// edit the course details
export const editServiceDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {

    console.log(token);
    const response = await apiConnector("PUT", UPDATE_SERVICE, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("UPDATE SERVICE API RESPONSE............",response?.data);
    if (!response?.data?.success) {
      throw new Error("Could Not Update Service Details");
    }
    toast.success("Service Details Updated Successfully");
    result = response?.data?.service1;
  } catch (error) {
    console.log("UPDATE SERVICE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

///////////////////////////////////////////////////////////

// fetching all courses under a specific instructor
export const fetchProviderServices = async (data,token) => {
    let result = []
    const toastId = toast.loading("Loading...")
    try {

      const response = await apiConnector("POST", GET_PROVIDER_SERVICES, data, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      });
      console.log("PROVIDER SERVICES API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not fetch Provider Services")
      }
      result = response?.data?.data
    } catch (error) {
      console.log("PROVIDER SERVICES API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }
  

///////////////////////////////////////////////////////////
// delete a course
export const deleteService = async (serviceId, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  console.log("service id :",serviceId);
  try {
    const response = await apiConnector("DELETE", DELETE_SERVICE, { serviceId: serviceId },{
      
      Authorization: `Bearer ${token}`,
    });
    console.log("DELETE SERVICE  API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not delete service ");
    }
    toast.success("Service  deleted Successfully");
    result = response?.data?.success;
  } catch (error) {
    console.log("DELETE SERVICE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
}

  
///////////////////////////////////////////////////////////
//UPDATE_SERVICE_PROGRESS
export const updateServiceProgress = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", UPDATE_SERVICE_PROGRESS, data, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      })
      console.log("UPDATE SERVICE PROGRESS API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Update Service Progress")
      }
      toast.success("Service Progress Updated Successfully")
      result = response?.data?.data
    } catch (error) {
      console.log("UPDATE SERVICE PROGRESS API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }
/////////////////////////////////////////////////////////
//GET_SERVICE_DETAILS
export const fetchServiceDetails = async (serviceId) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    console.log(serviceId)
    const response = await apiConnector("POST", GET_SERVICE_DETAILS,
       {
        serviceId
       }
    );
    console.log("GET SERVICE DETAILS API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Retrieve Service Details");
    }
    toast.success("Service Details Retrieved Successfully");
    result = response?.data?.service;
  } catch (error) {
    console.log("GET SERVICE DETAILS API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
///////////////////////////////////////////////////////////
// add the course details
export const addServiceSlots = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_SERVICE_SLOTS, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("CREATE SERVICE SLOTS API RESPONSE............", response);
    if (!response.data?.service) {
      throw new Error("Could Not Add Service slots ");
    }
    toast.success("Service slots Added Successfully");
    result = response.data.service;
    console.log(result);
  } catch (error) {
    console.log("CREATE SERVICE SLOTS API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
}

///////////////////////////////////////////////////////////////////////////////////////
export const fetchServiceSlots = async (serviceId,date) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    console.log(serviceId,date)
    const response = await apiConnector("POST", GET_SLOTS_OF_SERVICE,
       {
        serviceId,date
       }
    );
    console.log("GET SERVICE SLOTS API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Retrieve Service slots");
    }
    toast.success("Service slots Retrieved Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("GET SERVICE SLOTS API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

////////////////////////////////////////////////////////////////////////////////////////
export const bookServiceSlots = async (data,token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    console.log(data,token)
    const response = await apiConnector("PUT", BOOK_SERVICE,data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("BOOKING SERVICE SLOTS API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not book Service slots");
    }
    toast.success("Service slots Booked Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Book SERVICE SLOTS API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
/////////////////////////////////////////////////////////////////////////////////////////

export const fetchServicesBookedByUser = async (data,token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    console.log(data,token)
    const response = await apiConnector("POST", GET_ALL_BOOKED_SERVICES,data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("FETCH SERVICES BOOKED BY USER API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Service booked by user");
    }
    toast.success("Fetched Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("FETCH SERVICES BOOKED BY USER API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

///////////////////////////////////////////////////////////////////////////////////////////

export const fetchServiceSlotDetails = async (data,token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    console.log(data,token)
    const response = await apiConnector("PUT", GET_SERVICE_SLOT_DETAILS,data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("Fetch SERVICE SLOT Details by Provider API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Service slots");
    }
    toast.success("Service slot Fetched Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("Fetch SERVICE SLOT API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
/////////////////////////////////////////////////////////////////////////////////////////////

// edit the course details
export const cancelServiceSlot = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {

    console.log(data);
    const response = await apiConnector("POST", CANCEL_SERVICE, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("CANCEL SERVICE SLOT API RESPONSE............",response?.data);
    if (!response?.data?.message) {
      throw new Error("Could Not Cancel Service Slot");
    }
    toast.success("Service Slot Cancelled ");
    result = response?.data?.message;
  } catch (error) {
    console.log("CANCEL SERVICE SLOT API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

//////////////////////////////////////////////////////////////////////////////////
export const updateServiceSlotProgress = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {

    console.log(data);
    const response = await apiConnector("POST", UPDATE_SERVICE_PROGRESS, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log(" SERVICE SLOT PROGRESS UPDATE API RESPONSE............",response?.data);
    if (!response?.data?.message) {
      throw new Error("Could Not Update Service Slot progress");
    }
    toast.success("Service slot progress updated successfully");
    result = response?.data?.message;
  } catch (error) {
    console.log(" SERVICE SLOT PROGRESS UPDATE API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

//////////////////////////////////////////////////////////////////////////////////////////
// add the course details
export const createRating = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE SERVICE RATING AND REVIEW API RESPONSE............", response)
    // if (!response?.data?.message) {
    //   throw new Error("Could Not Add Service  R & R Details")
    // }
    toast.success(response?.data?.message)
   
  } catch (error) {
    console.log("CREATE SERVICE RATING AND REVIEW API ERROR............", error)
    toast.error(error?.response?.data?.message)
  }
  toast.dismiss(toastId)
  return result
}


///////////////////////////////////////////////////////////////////////////////////////////

export const fetchServiceRatingsReviews = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", FETCH_SERVICE_REVIEWS, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("FETCH SERVICE RATING AND REVIEW API RESPONSE............", response);

    if (response?.data?.ratingsAndReviews) {
      toast.dismiss(toastId);
      return response.data.ratingsAndReviews;
    } else {
      throw new Error("Could not fetch service ratings and reviews");
    }
  } catch (error) {
    console.log("FETCH SERVICE RATING AND REVIEW API ERROR............", error);
    toast.error(error?.response?.data?.message || "Error fetching service ratings and reviews");
    toast.dismiss(toastId);
    return [];
  }
};


//////////////////////////////////////////////////////////////////////////////////////////
// export const getAllServices = async () => {
//   const toastId = toast.loading("Loading...")
//   let result = []
//   try {
//     const response = await apiConnector("GET", GET_ALL_SERVICES)
//     if (!response?.data?.success) {
//       throw new Error("Could Not Fetch Service Categories")
//     }
//     result = response?.data?.data
//   } catch (error) {
//     console.log("GET_ALL_SERVICES API ERROR............", error)
//     toast.error(error.message)
//   }
//   toast.dismiss(toastId)
//   return result
// }
// /////////////////////////////////////////////////////////////////////
// export const fetchServiceDetails = async (courseId) => {
//   const toastId = toast.loading("Loading...")
//   //   dispatch(setLoading(true));
//   let result = null
//   try {
//     const response = await apiConnector("POST", COURSE_DETAILS_API, {
//       courseId,
//     })
//     console.log("COURSE_DETAILS_API API RESPONSE............", response)

//     if (!response.data.success) {
//       throw new Error(response.data.message)
//     }
//     result = response.data
//   } catch (error) {
//     console.log("COURSE_DETAILS_API API ERROR............", error)
//     result = error.response.data
//     // toast.error(error.response.data.message);
//   }
//   toast.dismiss(toastId)
//   //   dispatch(setLoading(false));
//   return result
// }

// // fetching the available course categories
// export const fetchCourseCategories = async () => {
//   let result = []
//   try {
//     const response = await apiConnector("GET", COURSE_CATEGORIES_API)
//     console.log("COURSE_CATEGORIES_API API RESPONSE............", response)
//     if (!response?.data?.success) {
//       throw new Error("Could Not Fetch Course Categories")
//     }
//     result = response?.data?.data
//   } catch (error) {
//     console.log("COURSE_CATEGORY_API API ERROR............", error)
//     toast.error(error.message)
//   }
//   return result
// }




// // create a section
// export const createSection = async (data, token) => {
//   let result = null
//   const toastId = toast.loading("Loading...")
//   try {
//     const response = await apiConnector("POST", CREATE_SECTION_API, data, {
//       Authorization: `Bearer ${token}`,
//     })
//     console.log("CREATE SECTION API RESPONSE............", response)
//     if (!response?.data?.success) {
//       throw new Error("Could Not Create Section")
//     }
//     toast.success("Course Section Created")
//     result = response?.data?.updatedCourse
//   } catch (error) {
//     console.log("CREATE SECTION API ERROR............", error)
//     toast.error(error.message)
//   }
//   toast.dismiss(toastId)
//   return result
// }

// // create a subsection
// export const createSubSection = async (data, token) => {
//   let result = null
//   const toastId = toast.loading("Loading...")
//   try {
//     const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
//       Authorization: `Bearer ${token}`,
//     })
//     console.log("CREATE SUB-SECTION API RESPONSE............", response)
//     if (!response?.data?.success) {
//       throw new Error("Could Not Add Lecture")
//     }
//     toast.success("Lecture Added")
//     result = response?.data?.data
//   } catch (error) {
//     console.log("CREATE SUB-SECTION API ERROR............", error)
//     toast.error(error.message)
//   }
//   toast.dismiss(toastId)
//   return result
// }

// // update a section
// export const updateSection = async (data, token) => {
//   let result = null
//   const toastId = toast.loading("Loading...")
//   try {
//     const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
//       Authorization: `Bearer ${token}`,
//     })
//     console.log("UPDATE SECTION API RESPONSE............", response)
//     if (!response?.data?.success) {
//       throw new Error("Could Not Update Section")
//     }
//     toast.success("Course Section Updated")
//     result = response?.data?.data
//   } catch (error) {
//     console.log("UPDATE SECTION API ERROR............", error)
//     toast.error(error.message)
//   }
//   toast.dismiss(toastId)
//   return result
// }

// // update a subsection
// export const updateSubSection = async (data, token) => {
//   let result = null
//   const toastId = toast.loading("Loading...")
//   try {
//     const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
//       Authorization: `Bearer ${token}`,
//     })
//     console.log("UPDATE SUB-SECTION API RESPONSE............", response)
//     if (!response?.data?.success) {
//       throw new Error("Could Not Update Lecture")
//     }
//     toast.success("Lecture Updated")
//     result = response?.data?.data
//   } catch (error) {
//     console.log("UPDATE SUB-SECTION API ERROR............", error)
//     toast.error(error.message)
//   }
//   toast.dismiss(toastId)
//   return result
// }

// // delete a section
// export const deleteSection = async (data, token) => {
//   let result = null
//   const toastId = toast.loading("Loading...")
//   try {
//     const response = await apiConnector("POST", DELETE_SECTION_API, data, {
//       Authorization: `Bearer ${token}`,
//     })
//     console.log("DELETE SECTION API RESPONSE............", response)
//     if (!response?.data?.success) {
//       throw new Error("Could Not Delete Section")
//     }
//     toast.success("Course Section Deleted")
//     result = response?.data?.data
//   } catch (error) {
//     console.log("DELETE SECTION API ERROR............", error)
//     toast.error(error.message)
//   }
//   toast.dismiss(toastId)
//   return result
// }
// // delete a subsection
// export const deleteSubSection = async (data, token) => {
//   let result = null
//   const toastId = toast.loading("Loading...")
//   try {
//     const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
//       Authorization: `Bearer ${token}`,
//     })
//     console.log("DELETE SUB-SECTION API RESPONSE............", response)
//     if (!response?.data?.success) {
//       throw new Error("Could Not Delete Lecture")
//     }
//     toast.success("Lecture Deleted")
//     result = response?.data?.data
//   } catch (error) {
//     console.log("DELETE SUB-SECTION API ERROR............", error)
//     toast.error(error.message)
//   }
//   toast.dismiss(toastId)
//   return result
// }

// // get full details of a course
// export const getFullDetailsOfCourse = async (courseId, token) => {
//   const toastId = toast.loading("Loading...")
//   //   dispatch(setLoading(true));
//   let result = null
//   try {
//     const response = await apiConnector(
//       "POST",
//       GET_FULL_COURSE_DETAILS_AUTHENTICATED,
//       {
//         courseId,
//       },
//       {
//         Authorization: `Bearer ${token}`,
//       }
//     )
//     console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response)

//     if (!response.data.success) {
//       throw new Error(response.data.message)
//     }
//     result = response?.data?.data
//   } catch (error) {
//     console.log("COURSE_FULL_DETAILS_API API ERROR............", error)
//     result = error.response.data
//     // toast.error(error.response.data.message);
//   }
//   toast.dismiss(toastId)
//   //   dispatch(setLoading(false));
//   return result
// }

// // mark a lecture as complete
// export const markLectureAsComplete = async (data, token) => {
//   let result = null
//   console.log("mark complete data", data)
//   const toastId = toast.loading("Loading...")
//   try {
//     const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
//       Authorization: `Bearer ${token}`,
//     })
//     console.log(
//       "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
//       response
//     )

//     if (!response.data.message) {
//       throw new Error(response.data.error)
//     }
//     toast.success("Lecture Completed")
//     result = true
//   } catch (error) {
//     console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
//     toast.error(error.message)
//     result = false
//   }
//   toast.dismiss(toastId)
//   return result
// }

// // create a rating for course
// export const createRating = async (data, token) => {
//   const toastId = toast.loading("Loading...")
//   let success = false
//   try {
//     const response = await apiConnector("POST", CREATE_RATING_API, data, {
//       Authorization: `Bearer ${token}`,
//     })
//     console.log("CREATE RATING API RESPONSE............", response)
//     if (!response?.data?.success) {
//       throw new Error("Could Not Create Rating")
//     }
//     toast.success("Rating Created")
//     success = true
//   } catch (error) {
//     success = false
//     console.log("CREATE RATING API ERROR............", error)
//     toast.error(error.message)
//   }
//   toast.dismiss(toastId)
//   return success
// }

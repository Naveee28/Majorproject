import { toast } from "react-hot-toast";

import { apiConnector } from "../apiConnector";
import { providerRentItem ,userRentItem ,RentItemSlots ,ratingAndReviewEndpoints } from "../apis";


//PROVIDER SIDE Rent Item ENDPOINTS
export const {  
  CREATE_RENT_ITEM,
  UPDATE_RENT_ITEM,
  GET_PROVIDER_RENT_ITEMS,
  DELETE_RENT_ITEM,
  UPDATE_RENT_ITEM_PROGRESS
} =providerRentItem 

//USER SIDE RENT ITEM ENDPOINTS
export const {  
  BOOK_RENT_ITEM,
  CANCEL_RENT_ITEM,
  GET_ALL_BOOKED_RENT_ITEMS,
  GET_RENT_ITEM_DETAILS
} = userRentItem;

// RENT ITEM SLOTS
const{
   CREATE_RENT_ITEM_SLOTS,
  GET_SLOTS_OF_RENT_ITEM,
  GET_RENT_ITEM_SLOT_DETAILS
} = RentItemSlots 

const {
  CREATE_RATING_API,
  FETCH_RENTITEM_REVIEWS
 }=ratingAndReviewEndpoints;

 
//////////////////////////////////////////////////////////////

// add the course details
export const addRentItemDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_RENT_ITEM, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE RENT_ITEM  API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Add Rent Item Details")
    }
    toast.success("Rent Item Details Added Successfully")
    result = response?.data?.rentItem
  } catch (error) {
    console.log("CREATE_RENT_ITEM API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

///////////////////////////////////////////////////////////

// edit the course details
export const editRentItemDetails = async (data, token) => {
let result = null;
const toastId = toast.loading("Loading...");
try {

  console.log(token);
  const response = await apiConnector("PUT", UPDATE_RENT_ITEM, data, {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  });

  console.log("UPDATE_RENT_ITEMAPI RESPONSE............",response?.data);
  if (!response?.data?.success) {
    throw new Error("Could Not Update Rent Item Details");
  }
  toast.success("Rent Item Details Updated Successfully");
  result = response?.data?.rentItem1;
} catch (error) {
  console.log("UPDATE_RENT_ITEM API ERROR............", error);
  toast.error(error.message);
}
toast.dismiss(toastId);
return result;
};

///////////////////////////////////////////////////////////

// fetching all courses under a specific instructor
export const fetchProviderRentItems = async (data,token) => {
  let result = []
  const toastId = toast.loading("Loading...")
  try {

    const response = await apiConnector("POST", GET_PROVIDER_RENT_ITEMS, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("GET_PROVIDER_RENT_ITEMS API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not fetch Provider Rent Items")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("GET_PROVIDER_RENT_ITEMS API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}


///////////////////////////////////////////////////////////
// delete a course
export const deleteRentItem = async (rentItemId, token) => {
let result = null;
const toastId = toast.loading("Loading...");
console.log("rentItem Id:",rentItemId);
try {
  const response = await apiConnector("DELETE", DELETE_RENT_ITEM, { rentItemId: rentItemId },{
    
    Authorization: `Bearer ${token}`,
  });
  console.log("DELETE_RENT_ITEM API RESPONSE............", response);
  if (!response?.data?.success) {
    throw new Error("Could Not delete rent item ");
  }
  toast.success("Rent Item deleted Successfully");
  result = response?.data?.success;
} catch (error) {
  console.log("DELETE_RENT_ITEM API ERROR............", error);
  toast.error(error.message);
}
toast.dismiss(toastId);
return result;
}


///////////////////////////////////////////////////////////
//UPDATE_SERVICE_PROGRESS
export const updateRentItemProgress = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_RENT_ITEM_PROGRESS, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("UPDATE_RENT_ITEM_PROGRESS API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Rent Item Progress")
    }
    toast.success("Rent Item Progress Updated Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("UPDATE_RENT_ITEM_PROGRESS API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}
/////////////////////////////////////////////////////////
//GET_SERVICE_DETAILS
export const fetchRentItemDetails = async (rentItemId) => {
let result = null;
const toastId = toast.loading("Loading...");
try {
  console.log(rentItemId)
  const response = await apiConnector("POST", GET_RENT_ITEM_DETAILS,
     {
      rentItemId
     }
  );
  console.log("GET_RENT_ITEM_DETAILS API RESPONSE............", response);
  if (!response?.data?.success) {
    throw new Error("Could Not Retrieve Rent Item Details");
  }
  toast.success("Rent Item Details Retrieved Successfully");
  result = response?.data?.rentItem;
} catch (error) {
  console.log("GET_RENT_ITEM_DETAILS API ERROR............", error);
  toast.error(error.message);
}
toast.dismiss(toastId);
return result;
};
///////////////////////////////////////////////////////////
// add the course details
export const addRentItemSlots = async (data, token) => {
let result = null;
const toastId = toast.loading("Loading...");
try {
  const response = await apiConnector("POST", CREATE_RENT_ITEM_SLOTS, data, {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  });
  console.log("CREATE_RENT_ITEM_SLOTS API RESPONSE............", response);
  if (!response.data?.rentItem) {
    throw new Error("Could Not Add Rent Item slots ");
  }
  toast.success("Rent Item slots Added Successfully");
  result = response.data.rentItem;
  console.log(result);
} catch (error) {
  console.log("CREATE_RENT_ITEM_SLOTS API ERROR............", error);
  toast.error(error.message);
}
toast.dismiss(toastId);
return result;
}

///////////////////////////////////////////////////////////////////////////////////////
export const fetchRentItemSlots = async (rentItemId,date) => {
let result = null;
const toastId = toast.loading("Loading...");
try {
  console.log(rentItemId,date)
  const response = await apiConnector("POST", GET_SLOTS_OF_RENT_ITEM,
     {
      rentItemId,date
     }
  );
  console.log("GET RENT ITEM SLOTS API RESPONSE............", response);
  if (!response?.data?.success) {
    throw new Error("Could Not Retrieve Rent Item slots");
  }
  toast.success("Rent Item slots Retrieved Successfully");
  result = response?.data?.data;
} catch (error) {
  console.log("GET RENT ITEM SLOTS API ERROR............", error);
  toast.error(error.message);
}
toast.dismiss(toastId);
return result;
};

////////////////////////////////////////////////////////////////////////////////////////
export const bookRentItemSlots = async (data,token) => {
let result = null;
const toastId = toast.loading("Loading...");
try {
  console.log(data,token)
  const response = await apiConnector("PUT", BOOK_RENT_ITEM,data, {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  });
  console.log("BOOK_RENT_ITEM SLOTS API RESPONSE............", response);
  if (!response?.data?.success) {
    throw new Error("Could Not book Rent Item slots");
  }
  toast.success("Rent Item slots Booked Successfully");
  result = response?.data?.data;
} catch (error) {
  console.log("BOOK_RENT_ITEM SLOTS API ERROR............", error);
  toast.error(error.message);
}
toast.dismiss(toastId);
return result;
};
/////////////////////////////////////////////////////////////////////////////////////////

export const fetchRentItemsBookedByUser = async (data,token) => {
let result = null;
const toastId = toast.loading("Loading...");
try {
  console.log(data,token)
  const response = await apiConnector("POST", GET_ALL_BOOKED_RENT_ITEMS,data, {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  });
  console.log("FETCH RENT ITEMS BOOKED BY USER API RESPONSE............", response);
  if (!response?.data?.success) {
    throw new Error("Could Not Fetch RENT ITEMS booked by user");
  }
  toast.success("Fetched Successfully");
  result = response?.data?.data;
} catch (error) {
  console.log("FETCH RENT ITEMS BOOKED BY USER API ERROR............", error);
  toast.error(error.message);
}
toast.dismiss(toastId);
return result;
};

///////////////////////////////////////////////////////////////////////////////////////////

export const fetchRentItemSlotDetails = async (data,token) => {
let result = null;
const toastId = toast.loading("Loading...");
try {
  console.log(data,token)
  const response = await apiConnector("PUT", GET_RENT_ITEM_SLOT_DETAILS,data, {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  });
  console.log("Fetch RENT_ITEM_SLOT_DETAILS by Provider API RESPONSE............", response);
  if (!response?.data?.success) {
    throw new Error("Could Not Fetch Rent Item slots");
  }
  toast.success("Rent Item slot Fetched Successfully");
  result = response?.data?.data;
} catch (error) {
  console.log("Fetch GET_RENT_ITEM_SLOT_DETAILS API ERROR............", error);
  toast.error(error.message);
}
toast.dismiss(toastId);
return result;
};
/////////////////////////////////////////////////////////////////////////////////////////////

// edit the course details
export const cancelRentItemSlot = async (data, token) => {
let result = null;
const toastId = toast.loading("Loading...");
try {

  console.log(data);
  const response = await apiConnector("POST", CANCEL_RENT_ITEM, data, {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  });

  console.log("CANCEL_RENT_ITEM SLOT API RESPONSE............",response?.data);
  if (!response?.data?.message) {
    throw new Error("Could Not Cancel Rent Item Slot");
  }
  toast.success("Rent Item Slot Cancelled ");
  result = response?.data?.message;
} catch (error) {
  console.log("CANCEL_RENT_ITEM SLOT API ERROR............", error);
  toast.error(error.message);
}
toast.dismiss(toastId);
return result;
};

//////////////////////////////////////////////////////////////////////////////////
export const updateRentItemSlotProgress = async (data, token) => {
let result = null;
const toastId = toast.loading("Loading...");
try {

  console.log(data);
  const response = await apiConnector("POST", UPDATE_RENT_ITEM_PROGRESS, data, {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  });

  console.log("RENT_ITEM_PROGRESS UPDATE API RESPONSE............",response?.data);
  if (!response?.data?.message) {
    throw new Error("Could Not Update Rent Item Slot progress");
  }
  toast.success("Rent Item slot progress updated successfully");
  result = response?.data?.message;
} catch (error) {
  console.log(" RENT_ITEM_PROGRESS UPDATE API ERROR............", error);
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
  console.log("CREATE RENT ITEM RATING AND REVIEW API RESPONSE............", response)
  // if (!response?.data?.message) {
  //   throw new Error("Could Not Add Service  R & R Details")
  // }
  toast.success(response?.data?.message)
 
} catch (error) {
  console.log("CREATE RENT ITEM RATING AND REVIEW API ERROR............", error)
  toast.error(error?.response?.data?.message)
}
toast.dismiss(toastId)
return result
}


///////////////////////////////////////////////////////////////////////////////////////////

export const fetchRentItemRatingsReviews = async (data, token) => {
const toastId = toast.loading("Loading...");
try {
  const response = await apiConnector("POST", FETCH_RENTITEM_REVIEWS, data, {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  });
  console.log("FETCH_RENT_REVIEWS RATING AND REVIEW API RESPONSE............", response);

  if (response?.data?.ratingsAndReviews) {
    toast.dismiss(toastId);
    return response.data.ratingsAndReviews;
  } else {
    throw new Error("Could not fetch rent item ratings and reviews");
  }
} catch (error) {
  console.log("FETCH_RENT_REVIEWS RATING AND REVIEW API ERROR............", error);
  toast.error(error?.response?.data?.message || "Error fetching rent item ratings and reviews");
  toast.dismiss(toastId);
  return [];
}
};


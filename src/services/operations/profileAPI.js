import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"

import { setLoading, setUser } from "../../slices/profileSlice"
import { profileEndpoints,ratingAndReviewEndpoints } from "../apis"
import { logout } from "./authAPI"
import { setWishlist } from "../../slices/wishlist"

const {
  GET_USER_DETAILS_API,
  GET_DASHBOARD_SERVICE_DATA,
  GET_DASHBOARD_RENTITEMS_DATA
} = profileEndpoints

const {
 FETCH_ALL_RATINGREVIEWS
} =ratingAndReviewEndpoints

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
      dispatch(setUser({ ...response.data.data, image: userImage }));
      dispatch(setWishlist(response.data.wishlist)); 
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR............", error)
      toast.error("Could Not Get User Details")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

////////////////////////////////////////////////////////////////////////////////////
export const getProviderServicesData = async (data,token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
   
    const response = await apiConnector("POST", GET_DASHBOARD_SERVICE_DATA,data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("GET PROVIDER SERVICE DATA API RESPONSE............", response);
    if (!response?.data?.services) {
      throw new Error("Could Not Retrieve Service stats");
    }
    toast.success("Service Stats Retrieved Successfully");
    result = response?.data?.services;
  } catch (error) {
    console.log("GET PROVIDER SERVICE DATA API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
/////////////////////////////////////////////////////////////////////////////////////
export const getProviderRentItemsData = async (data,token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
   
    const response = await apiConnector("POST", GET_DASHBOARD_RENTITEMS_DATA,data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("GET PROVIDER RENTITEM DATA API RESPONSE............", response);
    if (!response?.data?.rents) {
      throw new Error("Could Not Retrieve Service RentItems");
    }
    toast.success("Rent Items Stats Retrieved Successfully");
    result = response?.data?.rents;
  } catch (error) {
    console.log("GET PROVIDER RENTITEM DATA API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
/////////////////////////////////////////////////////////////////////////////////////


export const getAllRatingReview = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", FETCH_ALL_RATINGREVIEWS)
    console.log("FETCH_ALL_RATINGREVIEWS API RESPONSE............", response)
    if (!response?.data) {
      throw new Error("Could Not Fetch Rating and Reviews")
    }
    result = response?.data?.ratingsAndReviews
  } catch (error) {
    console.log("FETCH_ALL_RATINGREVIEWS ERROR............", error)
    toast.error(error.message)
  }
  return result
}
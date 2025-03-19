
import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"

import { setLoading, setWishlist } from "../../slices//wishlist"
import { wishlistEndpoints } from "../apis"


const {
    FETCH_WISHLIST,
    ADD_SERVICE_TO_WISHLIST ,
    REMOVE_SERVICE_FROM_WISHLIST,
    ADD_RENT_TO_WISHLIST,
    REMOVE_RENT_FROM_WISHLIST 
} = wishlistEndpoints


export const fetchWishList = async (userId, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    
    console.log(token);
    const response = await apiConnector("POST", FETCH_WISHLIST, {userId : userId}, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("FETCH WISHLIST API RESPONSE............",response?.data);
    if (!response?.data?.success) {
      throw new Error("Could Not fetch wishlist");
    }
    //toast.success("Successfully Fetched wishlist");
    result = response?.data?.user?.wishlist;
  } catch (error) {
    console.log("FETCH WISHLIST API ERROR............", error);
    //toast.error(error?.response?.data?.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const addServiceToWishlist = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
  
      console.log(token);
      const response = await apiConnector("POST", ADD_SERVICE_TO_WISHLIST, data, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      });
  
      console.log("ADD SERVICE TO WISHLIST API RESPONSE............",response?.data);
      if (!response?.data?.success) {
        throw new Error("Could Not add Service to wishlist");
      }
      //toast.success("Successfully added Service to wishlist");
      result = response?.data?.wishlist;
    } catch (error) {
      console.log("ADD SERVICE TO WISHLIST API ERROR............", error);
     // toast.error(error?.response?.data?.message);
    }
    toast.dismiss(toastId);
    return result;
  };

  export const removeServiceFromWishlist = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
  
      console.log(token);
      const response = await apiConnector("POST", REMOVE_SERVICE_FROM_WISHLIST, data, {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      });
  
      console.log("REMOVE SERVICE FROM WISHLIST API RESPONSE............",response?.data);
      if (!response?.data?.message) {
        throw new Error("Could Not remove Service from wishlist");
      }
      //toast.success("Successfully removed Service from wishlist");
      result = response?.data?.wishlist;
    } catch (error) {
      console.log("REMOVE SERVICE FROM WISHLIST API ERROR............", error);
      //toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
  };

  
export const addRentItemToWishlist = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {

    console.log(token);
    const response = await apiConnector("POST", ADD_RENT_TO_WISHLIST, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("ADD RENT TO WISHLIST API RESPONSE............",response?.data);
    if (!response?.data?.success) {
      throw new Error("Could Not add Rent to wishlist");
    }
    toast.success("Successfully added Rent to wishlist");
    result = response?.data?.service1;
  } catch (error) {
    console.log("ADD RENT TO WISHLIST API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const removeRentItemFromWishlist = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {

    console.log(token);
    const response = await apiConnector("POST", REMOVE_RENT_FROM_WISHLIST, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("REMOVE RENT FROM WISHLIST API RESPONSE............",response?.data);
    if (!response?.data?.success) {
      throw new Error("Could Not remove rent from wishlist");
    }
    toast.success("Successfully removed REnt from wishlist");
    result = response?.data?.service1;
  } catch (error) {
    console.log("REMOVE RENT FROM WISHLIST API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};
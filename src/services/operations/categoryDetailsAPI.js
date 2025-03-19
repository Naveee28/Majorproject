import { toast } from "react-hot-toast"

import { apiConnector } from "../apiConnector"
import { categories } from "../apis"

const { FETCH_CATEGORIES_API,
        CREATE_CATEGORY,
         EDIT_CATEGORY,
          GET_CATEGORY_PAGE_DETAILS,
          GET_SEARCH_PAGE_DETAILS,
          GET_RECOMMEND_DATA
         }= categories;

export const fetchAllCategories = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", FETCH_CATEGORIES_API)
    console.log("FETCH_CATEGORIES_API API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Categories")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("FETCH_CATEGORIES_API ERROR............", error)
    toast.error(error.message)
  }
  return result
}

export const addCategory = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  console.log("Entered ..")
  console.log("create category url ",CREATE_CATEGORY)
  try {
    console.log("Entered  inside try ..");
    const response = await apiConnector("POST", CREATE_CATEGORY, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    console.log("CREATE CATEGORY API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Add Category Details")
    }
    toast.success("Category Details Added Successfully")
    result = response?.data?.data
  } catch (error) {
    console.log("CREATE CATEGORY API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const updateCategory = async (data, id, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("PUT", EDIT_CATEGORY.replace(":id", id), data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    console.log("UPDATE CATEGORY API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not update Category Details");
    }
    toast.success("Category details Updated Successfully");
    result = response?.data?.data;
  } catch (error) {
    console.log("UPDATE CATEGORY API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getCategoryPageDetails = async (categoryId) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "POST", 
      GET_CATEGORY_PAGE_DETAILS,
       {
        categoryId: categoryId,
      });

    console.log("GET CATEGORY DETAILS API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Retrieve Category Details");
    }
    toast.success("Category Details Retrieved Successfully");
    result = response?.data;
  } catch (error) {
    console.log("GET CATEGORY DETAILS API ERROR............", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getSearchPageDetails = async (searchName,userId) => {
  let result = null;
  const toastId = toast.loading("Loading...");

  try {
    console.log("searchName", searchName);
    console.log("userId", userId);
    
    
    const response = await apiConnector(
      "POST", 
      GET_SEARCH_PAGE_DETAILS,
      {
        searchName:searchName,
        userId: userId,
      }
    );

    console.log("GET SEARCH DETAILS API RESPONSE:", response);
    
    if (!response?.data?.success) {
      throw new Error("Could Not Retrieve Search Details");
    }
    
    toast.success("Search Details Retrieved Successfully");
    result = response?.data;
  } catch (error) {
    console.log("GET SEARCH DETAILS API ERROR:", error);
    toast.error(error.message);
  }
  
  toast.dismiss(toastId);
  return result;
};

export const getRecommendDataDetails = async (userId, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    console.log("user Id : ",userId)
    console.log(token);
    const response = await apiConnector("POST", GET_RECOMMEND_DATA, {userId : userId}, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("FETCH RECOMMEND DATA API RESPONSE............",response?.data);
    if (!response?.status) {
      throw new Error("Recommend data");
    }
    //toast.success("Successfully Fetched wishlist");
    result = response?.data;
  } catch (error) {
    console.log("FETCH RECOMMEND DATA API ERROR............", error);
    //toast.error(error?.response?.data?.message);
  }
  toast.dismiss(toastId);
  return result;
};

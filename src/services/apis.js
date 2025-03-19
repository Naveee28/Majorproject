
const BASE_URL = process.env.REACT_APP_BASE_URL

/////////////////////////////////////////////////////////////////////////////////////////////////

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/resetPasswordToken",
  RESETPASSWORD_API: BASE_URL + "/auth/resetPassword",
}

/////////////////////////////////////////////////////////////////////////////////////////////////

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_DASHBOARD_SERVICE_DATA: BASE_URL + "/profile/providerDashboardServiceData",
  GET_DASHBOARD_RENTITEMS_DATA: BASE_URL + "/profile/providerDashboardRentItemData"
}

/////////////////////////////////////////////////////////////////////////////////////////////////

// CATAGORIES API
export const categories = {
  FETCH_CATEGORIES_API: BASE_URL + "/category/getAllCategories",
  CREATE_CATEGORY:BASE_URL+"/category/createCategory",
  EDIT_CATEGORY: BASE_URL+"/category/editCategory/:id",
  GET_CATEGORY_PAGE_DETAILS: BASE_URL+"/category/getCategoryPageDetails",

  GET_SEARCH_PAGE_DETAILS : BASE_URL + "/category/search",
  GET_RECOMMEND_DATA : BASE_URL + "/category/getRecommendations"
}

/////////////////////////////////////////////////////////////////////////////////////////////////

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

/////////////////////////////////////////////////////////////////////////////////////////////////


//PROVIDER SIDE SERVICE ENDPOINTS
export const providerService = {
  CREATE_SERVICE: BASE_URL + "/service/createService",
  UPDATE_SERVICE: BASE_URL + "/service/updateService",
  GET_PROVIDER_SERVICES : BASE_URL + "/service/getProviderServices",
  DELETE_SERVICE: BASE_URL + "/service/deleteService",
  UPDATE_SERVICE_PROGRESS: BASE_URL + "/service/updateServiceSlotProgress",

  //------------------------------unused------------------------------------------------------------
  GET_ALL_USERS_OF_SERVICE: BASE_URL + "/service/getAllUsersOfService/:serviceId",
}

//USER SIDE SERVICE ENDPOINTS
export const userService = {
  BOOK_SERVICE: BASE_URL + "/service/bookService",
  CANCEL_SERVICE: BASE_URL + "/service/cancelService",
  GET_ALL_BOOKED_SERVICES: BASE_URL + "/service/getServicesBookedByUser",
  GET_SERVICE_DETAILS: BASE_URL + "/service/getServiceDetails",
 
 //------------------------------unused------------------------------------------------------------
  CHECK_SERVICE_STATUS: BASE_URL + "/service/checkServiceStatus",
  GET_ALL_SERVICES: BASE_URL + "/service/GetAllServices",
}

// SERVICE SLOTS
export const ServiceSlots = {
  CREATE_SERVICE_SLOTS: BASE_URL + "/service/createServiceSlots",
  GET_SLOTS_OF_SERVICE: BASE_URL + "/service/getSlotsOfService",
  GET_SERVICE_SLOT_DETAILS:BASE_URL + "/service/getServiceSlotDetails",
  
//------------------------------unused------------------------------------------------------------
  UPDATE_SERVICE_SLOTS: BASE_URL + "/service/updateServiceSlots/:id",
  DELETE_SERVICE_SLOTS: BASE_URL + "/service/deleteServiceSlots/:id",
}

/////////////////////////////////////////////////////////////////////////////////////////////////

//PROVIDER SIDE Rent Item ENDPOINTS
export const providerRentItem = {
  CREATE_RENT_ITEM: BASE_URL + "/rent/createRentItem",
  UPDATE_RENT_ITEM: BASE_URL + "/rent/updateRentItem",
  GET_PROVIDER_RENT_ITEMS : BASE_URL + "/rent/getProviderRentItems",
  DELETE_RENT_ITEM: BASE_URL + "/rent/deleteRentItem",
  UPDATE_RENT_ITEM_PROGRESS: BASE_URL + "/rent/updateRentItemSlotProgress",

  //------------------------------unused------------------------------------------------------------
 // GET_ALL_USERS_OF_SERVICE: BASE_URL + "/service/getAllUsersOfService/:serviceId",
}

//USER SIDE RENT ITEM ENDPOINTS
export const userRentItem = {
  BOOK_RENT_ITEM: BASE_URL + "/rent/bookRentItem",
  CANCEL_RENT_ITEM: BASE_URL + "/rent/cancelRentItem",
  GET_ALL_BOOKED_RENT_ITEMS: BASE_URL + "/rent/getRentItemsBookedByUser",
  GET_RENT_ITEM_DETAILS: BASE_URL + "/rent/getRentItemDetails",
 
 //------------------------------unused------------------------------------------------------------
 // CHECK_SERVICE_STATUS: BASE_URL + "/service/checkServiceStatus",
 // GET_ALL_SERVICES: BASE_URL + "/service/GetAllServices",
}

// RENT ITEM SLOTS
export const RentItemSlots = {
  CREATE_RENT_ITEM_SLOTS: BASE_URL + "/rent/createRentItemSlots",
  GET_SLOTS_OF_RENT_ITEM: BASE_URL + "/rent/getSlotsOfRentItem",
  GET_RENT_ITEM_SLOT_DETAILS:BASE_URL + "/rent/getRentItemSlotDetails",
  
//------------------------------unused------------------------------------------------------------
  //UPDATE_RENT_ITEM_SLOTS: BASE_URL + "/service/updateRentItemSlots/:id",
  //DELETE_RENT_ITEM_SLOTS: BASE_URL + "/service/deleteRentItemSlots/:id",
}

///////////////////////////////////////////////////////////////////////////////////////////////////

//PRODUCT PROVIDER SIDE END POINTS
export const providerProduct={
  CREATE_PRODUCT:BASE_URL+"/product/createProduct",
  UPDATE_PRODUCT:BASE_URL+"/product/updateProduct/:id",
  DELETE_PRODUCT:BASE_URL+"/product/deleteProduct/:id",
  UPDATE_PRODUCT_PROGRESS:BASE_URL+"/product/updateProductProgress/:productID",
  GET_ALL_PRODUCTS: BASE_URL+"/product/getAllProducts",
  GET_PRODUCT_DETAILS : BASE_URL+"/product/getProductDetails/:id",
  GET_ALL_PRODUCTS_OF_PROVIER: BASE_URL+"/product/getAllProductsByProvider",
}

//PRODUCT CUSTOMER SIDE ENDPOINTS
export const userProduct = {
  BOOK_PRODUCT: BASE_URL + "/product/bookProduct/:productId",
  CANCEL_PRODUCT: BASE_URL + "/product/CancelProduct/:productId",
  RETURN_PRODUCT: BASE_URL + "/product/ReturnProduct/:productId",
  GET_PRODUCT_PROGRESS: BASE_URL + "/product/getProductProgress/:productID",
  GET_ALL_BOUGHT_PRODUCTS: BASE_URL + "/product/getAllBoughtProducts",
  GET_USERS_OF_PRODUCT: BASE_URL + "/product/getUsersOfProduct/:productId",
}; 

///////////////////////////////////////////////////////////////////////////////////////////////////

export const wishlistEndpoints = {
  ADD_SERVICE_TO_WISHLIST :BASE_URL +"/wishlist/addServiceToWishlist",
  REMOVE_SERVICE_FROM_WISHLIST : BASE_URL + "/wishlist/removeServiceFromWishlist",
  ADD_RENT_TO_WISHLIST : BASE_URL + "/wishlist/addRentToWishlist",
  REMOVE_RENT_FROM_WISHLIST : BASE_URL + "/wishlist/removeRentFromWishlist",
  FETCH_WISHLIST : BASE_URL + "/wishlist/fetchWishList",
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export const ratingAndReviewEndpoints = {
    CREATE_RATING_API: BASE_URL + "/rating/createRating",
    FETCH_SERVICE_REVIEWS : BASE_URL + "/rating/getServiceRatingReview",
    FETCH_RENTITEM_REVIEWS : BASE_URL + "/rating/getRentItemRatingReview",
    FETCH_ALL_RATINGREVIEWS : BASE_URL +"/rating/getAllRatingReview"
}

//////////////////////////////////////////////////////////////////////////////
// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
}
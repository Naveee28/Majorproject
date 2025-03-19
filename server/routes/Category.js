// - `/api/categories` (GET): Get a list of all available categories.
// - `/api/categories/:categoryId` (GET): Get details of a specific category.
// - `/api/categories/:categoryId/services` (GET): Get services under a specific category.
// - `/api/categories/:categoryId/products` (GET): Get products under a specific category.
// - `/api/categories/:categoryId/rents` (GET): Get rent items under a specific category.

// Import the required modules
const express = require("express")
const router = express.Router()
 // Your service model
 const Category = require("../models/Category"); // Your service model

// Search route using Atlas Search









// Categories Controllers Import
const {
  createCategory,
  getAllCategories,
  updateCategory,
  getCategoryDetails,

  getServicesUnderCategory,
  getProductsUnderCategory,
  getRentsUnderCategory,
  getcategoryPageDetails,

  getSearchPageDetails,
  getRecommendations
} = require("../controllers/Category")

// Importing Middlewares
const { auth,  isAdmin } = require("../middleware/Auth")

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here

router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/getAllCategories", getAllCategories)
router.put("/editCategory/:id",auth,isAdmin,updateCategory);
router.get("/getCategoryDetails/:id",auth,isAdmin,getCategoryDetails);

router.post("/getcategoryPageDetails", getcategoryPageDetails);
router.get("/getServicesUnderCategory/:id", getServicesUnderCategory)
router.get("/getProductsUnderCategory/:id", getProductsUnderCategory)
router.get("/getRentsUnderCategory/:id", getRentsUnderCategory)

router.post("/search", getSearchPageDetails);
router.post("/getRecommendations",getRecommendations);
  
// auth,isUser

module.exports = router;

const Category = require("../models/Category");
const User = require("../models/User");
const Service = require("../models/service");
const Rent = require("../models/rent");
const mongoose = require("mongoose");

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    let { name, description , status } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    console.log("name :",name," Description :",description);
    if (!status || status === undefined) {
      status = "Draft"
    }
    const categoryDetails = await Category.create({
      name: name,
      description: description,
      status:status,
      services:[],
      product:[],
      rent:[]
    });
    console.log(categoryDetails);
    return res.status(200).json({
      success: true,
      message: "Category created successfully",
      data:categoryDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the category ID is passed as a URL parameter
    let { name, description, status } = req.body;

    if (!name && !description && !status) {
      return res.status(400).json({
        success: false,
        message: "At least one field (name or description) must be provided",
      });
    }

    // Find the category by ID
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Update the category fields if provided
    if (name) category.name = name;
    if (description) category.description = description;
    if (status) category.status=status;

    // Save the updated category
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data :category, // Optionally include the updated category in the response
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get services under a specific category
exports.getServicesUnderCategory = async (req, res) => {
	try {
	  const { categoryId } = req.params;
	  const category = await Category.findById(categoryId).populate("services");
	  if (!category) {
		return res.status(404).json({ success: false, message: "Category not found" });
	  }
	  res.status(200).json({ success: true, data: category.services });
	} catch (error) {
	  return res.status(500).json({ success: false, message: error.message });
	}
  };
  
  // Get products under a specific category
  exports.getProductsUnderCategory = async (req, res) => {
	try {
	  const { categoryId } = req.params;
	  const category = await Category.findById(categoryId).populate("products");
	  if (!category) {
		return res.status(404).json({ success: false, message: "Category not found" });
	  }
	  res.status(200).json({ success: true, data: category.products });
	} catch (error) {
	  return res.status(500).json({ success: false, message: error.message });
	}
  };
  
  // Get rent items under a specific category
  exports.getRentsUnderCategory = async (req, res) => {
	try {
	  const { categoryId } = req.params;
	  const category = await Category.findById(categoryId).populate("rents");
	  if (!category) {
		return res.status(404).json({ success: false, message: "Category not found" });
	  }
	  res.status(200).json({ success: true, data: category.rents });
	} catch (error) {
	  return res.status(500).json({ success: false, message: error.message });
	}
  };

  exports.getCategoryDetails = async (req,res ) => {
    try {
      const { id } = req.params
  
      // Get category details including services, products, and rents
      const selectedCategory = await Category.findById(id).populate("services products rents").exec();
      // Handle the case when the category is not found
      if (!selectedCategory) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }

      res.status(200).json({ success: true, data: selectedCategory });
    }
    catch (error) {
      console.log(" ERROR FETCHING CATEGORY DETAILS ");
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  
  // Category Page Details
  exports.getcategoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
  
      // Get category details including services, products, and rents
      const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "services",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .populate({
        path: "products",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .populate({
        path: "rents",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      }).exec();
  
      // Handle the case when the category is not found
      if (!selectedCategory) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }

      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
  };
  exports.getSearchPageDetails = async (req, res) => {
    try {
        const { searchName, userId } = req.body;

        if (!searchName) {
            return res.status(400).json({ message: "Search term is required." });
        }

        console.log("searchName:", searchName, "userId:", userId);

        let results = await Category.aggregate([
            {
                $search: {
                    index: "category",
                    text: {
                        query: searchName,
                        path: ["name", "description"],
                        fuzzy: { maxEdits: 2 }
                    }
                }
            },
            {
                $lookup: {
                    from: "services",
                    localField: "services",
                    foreignField: "_id",
                    as: "serviceDetails"
                }
            },
            {
                $lookup: {
                    from: "rents",
                    localField: "rents",
                    foreignField: "_id",
                    as: "rentDetails"
                }
            },
            {
                $set: {
                    serviceDetails: {
                        $filter: {
                            input: "$serviceDetails",
                            as: "service",
                            cond: { $eq: ["$$service.status", "Published"] }
                        }
                    },
                    rentDetails: {
                        $filter: {
                            input: "$rentDetails",
                            as: "rent",
                            cond: { $eq: ["$$rent.status", "Published"] }
                        }
                    }
                }
            },
            {
                $project: { // Include only serviceDetails and rentDetails
                    serviceDetails: 1,
                    rentDetails: 1,
                    _id: 0 // Exclude _id if not needed
                }
            }
        ]);

        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            const user = await User.findById(userId);
            if (user) {
                user.searchHistory.unshift(searchName);
                user.searchHistory = user.searchHistory.slice(0, 5); // Keep last 5 searches
                await user.save();
            }
        } else {
            console.log("User not found or invalid userId for search history update.");
        }

        res.status(200).json({
            success: true,
            
                services: results.flatMap(category => category.serviceDetails),
                rents: results.flatMap(category => category.rentDetails)
            
        });

    } catch (error) {
        console.error("Error performing search:", error);
        res.status(500).json({ message: "Error searching services and rents", error: error.message });
    }
};


exports.getRecommendations = async (req, res) => {
  try {
      const { userId } = req.body;
      console.log("user Id : ",userId) // Assume user is authenticated
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      console.log(user.searchHistory);
      // Extract searchHistory and activityHistory
      const searchKeywords = [...new Set([...user.searchHistory, ...user.activityHistory])];

      if (!Array.isArray(searchKeywords) || searchKeywords.length === 0) {
          return res.status(400).json({ message: "Invalid search keywords" });
      }

      let allServices = new Set();
      let allRents = new Set();

      for (const keyword of searchKeywords) {
          let results = await Category.aggregate([
              {
                  $search: {
                      index: "category",
                      text: {
                          query: keyword,
                          path: ["name", "description"],
                          fuzzy: { maxEdits: 2 }
                      }
                  }
              },
              {
                  $lookup: {
                      from: "services",
                      localField: "services",
                      foreignField: "_id",
                      as: "serviceDetails"
                  }
              },
              {
                  $lookup: {
                      from: "rents",
                      localField: "rents",
                      foreignField: "_id",
                      as: "rentDetails"
                  }
              },
              {
                  $addFields: {
                      serviceDetails: {
                          $filter: {
                              input: "$serviceDetails",
                              as: "service",
                              cond: { $eq: ["$$service.status", "Published"] }
                          }
                      },
                      rentDetails: {
                          $filter: {
                              input: "$rentDetails",
                              as: "rent",
                              cond: { $eq: ["$$rent.status", "Published"] }
                          }
                      }
                  }
              },
              {
                  $addFields: {
                      serviceDetails: { $slice: ["$serviceDetails", 2] }, // Get only 2 services per keyword
                      rentDetails: { $slice: ["$rentDetails", 2] } // Get only 2 rentals per keyword
                  }
              }
          ]);

          results.forEach(category => {
              category.serviceDetails.forEach(service => allServices.add(JSON.stringify(service)));
              category.rentDetails.forEach(rent => allRents.add(JSON.stringify(rent)));
          });
      }

      // Convert sets back to array and parse JSON
      const uniqueServices = Array.from(allServices).map(service => JSON.parse(service));
      const uniqueRents = Array.from(allRents).map(rent => JSON.parse(rent));

      
      res.status(200).json({
        success: true,
        data: 
          { services: uniqueServices, rents: uniqueRents } 
        ,
      });
  } catch (error) {
      console.error("Error performing search:", error);
      res.status(500).json({ message: "Error searching services and rents" });
  }
};

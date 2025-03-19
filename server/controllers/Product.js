const User = require('../models/User');
const Category = require('../models/Category');
const Product=require('../models/Product');
const ProductProgress=require("../models/ProductProgress");
const { uploadImageToCloudinary }= require('../utils/ImageUploder');
const RatingAndReview= require('../models/RatingAndReviews');

/*----------------------------Producer side ----------------------------------------*/
// 1. create product
exports.createProduct = async (req, res) => {
    try {
        // Destructure fields from the request body
        const {
            name,
            description,
            price,
            category,
            quantity,
        } = req.body;
        const userId = req.user.id;
        let thumbnailUrl="";

        // Check if all required fields are present
        if (
            !name ||
            !description ||
            !price ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message: 'All required fields are not provided.',
            });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Upload the Thumbnail to Cloudinary
		if(req.files)
            {
                const thumbnail = req.files.thumbnailImage;
                const thumbnailImage = await uploadImageToCloudinary(
                    thumbnail,
                    process.env.FOLDER_NAME
                );
                console.log(thumbnailImage);
                thumbnailUrl=thumbnailImage.secure_url;
            }

        // Create the product
        const product = await Product.create({
            name,
            description,
            provider:userId,
            price,
            thumbnail:thumbnailUrl,
            category,
            ratingAndReviews: [],
            quantity,
            peopleBought:[],
        });

        // Update the user's products array with the new product ID
        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { products: product._id } },
            { new: true }
        );

        // Update the category's products array with the new product ID
        await Category.findByIdAndUpdate(
            category,
            { $push: { products: product._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            data : product,
            message: 'Product created successfully.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Product creation failed. Please try again.',
        });
    }
};

//2. Update product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get the product ID from params
        const updateFields = req.body; // Get the update fields from request body

        // Check if the product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check if user is trying to edit provider, RatingAndReviews, or peopleBought
        if ('provider' in updateFields || 'RatingAndReviews' in updateFields || 'peopleBought' in updateFields) {
            return res.status(400).json({
                success: false,
                message: 'You are not allowed to edit the "provider", "RatingAndReviews", or "peopleBought" fields',
            });
        }

        // gets the keys from the updatefields of json object
        const validFields = Object.keys(updateFields);
        //filters the allowed fields from service schema
        const allowedFields = Object.keys(Product.schema.paths).filter(
            field => field !== 'provider' && field !== 'RatingAndReviews' && field !== 'peopleBought'
        );

        //checks if every update filed is in allowed fields
        //if any one of the update field is not in the allowed fields it will be false
        const isValidOperation = validFields.every(field => allowedFields.includes(field));
        if (!isValidOperation) {
            return res.status(400).json({
                success: false,
                message: 'Invalid update fields',
            });
        }

        if(req.files)
            {
                const thumbnail=req.files.thumbnailImage;
                const thumbnailImage = await uploadImageToCloudinary(
                    thumbnail,
                    process.env.FOLDER_NAME
                );
                product.thumbnail=thumbnailImage.secure_url;
            }


        // Update the product
        Object.keys(updateFields).forEach(async field => {
            if (field === 'category') {
                // Remove the product ID from the previous category's products array
                await Category.findByIdAndUpdate(product.category, { $pull: { products: id } });

                // Update the product's category
                product.category = updateFields[field];

                // Add the product ID to the new category's products array
                await Category.findByIdAndUpdate(updateFields[field], { $push: { products: id } });
            } else {
                product[field] = updateFields[field];
            }
        });
        await product.save();

        return res.status(200).json({
            success: true,
            data: product,
            message: 'Product updated successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Product update failed. Please try again.',
        });
    }
};

//3. Get all product details
exports.getAllProducts = async (req, res) => {
    try {
        // Find all products and populate all fields of reference
        const products = await Product.find({})
            .populate({
                path: 'provider',
                select: 'firstName lastName email contactNumber',
            })
            .populate({
                path: 'category',
                select: 'name description',
            })
            .populate({
                path: 'RatingAndReviews',
                select: 'user rating review',
                populate: {
                    path: 'user',
                    select: 'firstName lastName email',
                },
            })
            .populate({
                path: 'peopleBought',
                select: 'firstName lastName email',
            })
            .exec();

        return res.status(200).json({
            success: true,
            data: products,
            message: 'All products retrieved successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve products. Please try again.',
        });
    }
};

// 4. get Specific product details
exports.getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;

        //check if product exists
        const item = await Product.findById(id);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product  not found" 
            });
        }
        // Find all products and populate all fields of reference
        const products = await Product.findById(id)
            .populate({
                path: 'provider',
                select: 'firstName lastName email contactNumber',
            })
            .populate({
                path: 'category',
                select: 'name description',
            })
            .populate({
                path: 'RatingAndReviews',
                select: 'user rating review',
                populate: {
                    path: 'user',
                    select: 'firstName lastName email',
                },
            })
            .populate({
                path: 'peopleBought',
                select: 'firstName lastName email',
            })
            .exec();

        return res.status(200).json({
            success: true,
            data: products,
            message: 'All products retrieved successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve products. Please try again.',
        });
    }
};

// 5. Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get the product ID from params

        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Delete all rating and reviews associated with the product
        await RatingAndReview.deleteMany({ 'ID': id });

        // Remove the product ID from the provider's products array
        await User.updateMany({}, { $pull: { products: id } });

        // Remove the product ID from the category's products array
        await Category.updateMany({}, { $pull: { products: id } });

        // Delete the product progress associated with the product
        await ProductProgress.deleteMany({ 'productID': id });

        // Delete the product
        await Product.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Product deletion failed. Please try again.',
        });
    }
};

exports.getAllProductsByProvider = async (req, res) => {
    const providerId = req.user.id; 
    try {
        const products = await Product.find({ provider: providerId }).sort({ since: -1 });

        res.status(200).json({ 
            success:true,
            data:products,
            message:"All products fetched successfully ",
        });
    } catch (error) {
        console.log(" Could not Fetch Products of the Provider ",error.message)
        res.status(500).json({ message: "Internal server error" });
    }
};

//6. update Product Progress
exports.updateProductProgress = async (req, res) => {
    try {
      const userId = req.user.id;
      const productID= req.params.productID;
      const { progress } = req.body; // Assuming the service ID is sent in the request body
  
      // Find the service progress document for the user and service
      const productProgress = await ProductProgress.findOne({productID });
  
      if (!productProgress) {
        return res.status(404).json({ success: false, message: "Product progress not found" });
      }
      
      //updating the product progress
     productProgress.orderinfo.push({
        status: progress,
        statusAt: Date.now(),
    });
      await productProgress.save();

      // Return the status information
      return res.status(200).json({
        success: true,
        data: productProgress,
        message:'Product status Updated successfully'
      });
    } catch (error) {
      console.error("Error checking Product status:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/*----------------------------Customer side ----------------------------------------*/
//7. Book product
exports.BookProduct = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product is available
        if (product.status !== 'available') {
            return res.status(400).json({ message: 'Product is out of stock' });
        }

        // Decrement the quantity and update status if necessary
        product.quantity--;
        if (product.quantity === 0) {
            product.status = 'out of stock';
        }

        // Add product ref to user schema
        user.products.push(productId);

        // Add user ref to peopleBought array
        product.peopleBought.push(userId);

        // Save the updated product and user
        await product.save();
        await user.save();

        // Update product progress to ordered
        const productProgress = new ProductProgress({
            productID: productId,
            userId: userId,
            orderinfo: [{ status: "Order Confirmed" ,statusAt: Date.now() }] 
        });
        await productProgress.save();

        return res.status(200).json({ message: 'Product booked successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

//8. cancel product
exports.CancelProduct = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product is in the user's products list
        if (!user.products.includes(productId)) {
            return res.status(400).json({ message: 'Product not purchased by user' });
        }

        // Check if the product is in the peopleBought array of the product
        if (!product.peopleBought.includes(userId)) {
            return res.status(400).json({ message: 'User not found in people bought list' });
        }

        // Check ProductProgress for order status
        const productProgress = await ProductProgress.findOne({ productID: productId, userId });
        if (!productProgress || productProgress.orderinfo[productProgress.orderinfo.length-1].status === 'Delivered' || productProgress.orderinfo[productProgress.orderinfo.length-1].status === "Out For Delivery") {
            return res.status(400).json({ message: 'Cannot cancel the Product' });
        }

        // Update product status to available
        if (product.status === 'out of stock') {
            product.status = 'available';
        }

        // Increase the quantity
        product.quantity++;

        // Remove product ref from user schema
        user.products = user.products.filter((id) => id.toString() !== productId);

        // Remove user ref from peopleBought array
        product.peopleBought = product.peopleBought.filter((id) => id.toString() !== userId);

        await product.save();
        await user.save();

        // Update product progress to cancelled
        productProgress.orderinfo.push({
            status: "Cancelled",
            statusAt: Date.now(),
        });
        // Save the updated product and user
        await productProgress.save();

        return res.status(200).json({ message: 'Product order cancelled successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 9. Return product
exports.ReturnProduct = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product is in the user's products list
        if (!user.products.includes(productId)) {
            return res.status(400).json({ message: 'Product not purchased by user' });
        }

        // Check if the product is in the peopleBought array of the product
        if (!product.peopleBought.includes(userId)) {
            return res.status(400).json({ message: 'User not found in people bought list' });
        }

        // Check ProductProgress for order status
        const productProgress = await ProductProgress.findOne({ productID: productId, userId });
        if (!productProgress || productProgress.orderinfo[productProgress.orderinfo.length-1].status !== 'Delivered') {
            return res.status(400).json({ message: 'Cannot return order that is not delivered' });
        }

        // Update product status to available
        if (product.status === 'out of stock') {
            product.status = 'available';
        }

        // Increase the quantity
        product.quantity++;

        // Remove product ref from user schema
        user.products = user.products.filter((id) => id.toString() !== productId);

        // Save the updated product and user
        await product.save();
        await user.save();

        // Update product progress to returned
        productProgress.orderinfo.push({
            status: "Returned",
            statusAt: Date.now(),
        });
        await productProgress.save();

        return res.status(200).json({ message: 'Product returned successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 10.get Product Progress
exports.getProductProgress = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming you have middleware to extract user ID from the request
      const productID = req.params.productID; // Assuming the service ID is sent in the request body

      // Find the service progress document for the user and service
      const productProgress = await ProductProgress.findOne({ productID, userId });
  
      if (!productProgress) {
        return res.status(404).json({ success: false, message: "Product progress not found" });
      }
  
      // Return the status information
      return res.status(200).json({
        success: true,
        data: productProgress.orderinfo,
      });
    } catch (error) {
      console.error("Error checking Product status:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// 11.getAllBookedProducts
exports.getAllBoughtProducts = async (req, res) => {
    const userId = req.user.id;

    try {
        // Find the user by ID
        const user = await User.findById(userId).populate({
            path: 'products',
            select: 'name description provider category',
            populate: [
                {
                    path: 'provider',
                    select: 'firstName lastName email contactNumber'
                },
                {
                    path: 'category',
                    select: 'name description'
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract the rent IDs from the user's rents
        const productIds = user.products.map(product => product._id);

        // Find the progress of each bought product
        const productProgress = await ProductProgress.find({ userId }).populate('productID');

        return res.status(200).json({ productItems : user.products, productProgress });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 12. Get all the users of the specific product
exports.getUsersOfProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Populate the peopleBought field in the product
        await product.populate('peopleBought', 'firstName lastName email contactNumber');

        // Extract user information from peopleBought
        const users = product.peopleBought.map(user => ({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            contactNumber: user.contactNumber
        }));

        return res.status(200).json({ users });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};




// 6. Product Endpoints:
//    - /api/products (GET): Get a list of all available products.
//    - /api/products/:productId (GET): Get details of a specific product.
//    - /api/products (POST): Create a new product.
//    - /api/products/:productId (PUT): Update details of a specific product.
//    - /api/products/:productId (DELETE): Delete a specific product.
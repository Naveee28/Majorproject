// Importing necessary modules and packages
const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const serviceRoutes = require("./routes/Service");
const productRoutes = require("./routes/Product");
const rentRoutes = require("./routes/Rent");
const categoryRoutes = require("./routes/Category");
const ratingRoutes = require("./routes/RatingAndReviews");
const wishlistRoutes = require("./routes/wishlist");


// Connecting to database
const database = require("./config/database");
database();


// Loading environment variables from .env file
const dotenv = require("dotenv");
dotenv.config();

// Setting up port number
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());

const cors = require("cors");
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

//cookieParser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// // Connecting to cloudinary
// const { cloudinaryConnect } = require("./config/cloudinary");
// cloudinaryConnect();

const fileUpload = require("express-fileupload");
app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: '/tmp/'
  }));


// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/service", serviceRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/rent", rentRoutes);
app.use("/api/v1/rating", ratingRoutes);
app.use("/api/v1/wishlist",wishlistRoutes);



// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

// End of code.

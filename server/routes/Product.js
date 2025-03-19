const express = require("express");
const router = express.Router();
const { auth, isUser, isAdmin, isProvider } = require("../middleware/Auth");

const {
    createProduct,
    updateProduct,
    getAllProducts,
    getProductDetails,
    deleteProduct,
    updateProductProgress,
    getAllProductsByProvider,

    BookProduct,
    CancelProduct,
    ReturnProduct,
    getProductProgress,
    getAllBoughtProducts,
    getUsersOfProduct
} = require('../controllers/Product');

/* ---------------- ROUTES for PRODUCTS ------------*/

router.post("/createProduct", auth, isProvider, createProduct)
router.put("/updateProduct/:id", auth, isProvider, updateProduct)
router.get("/getAllProducts", getAllProducts)
router.get("/getProductDetails/:id", getProductDetails)
router.delete("/deleteProduct/:id", auth, isProvider, deleteProduct)
router.put("/updateProductProgress/:productID", auth, isProvider, updateProductProgress)
router.get("/getAllProductsByProvider",auth,isProvider,getAllProductsByProvider)
/* ----------------CUSTOMER SIDE --------------- */

router.post("/bookProduct/:productId",auth,isUser, BookProduct)
router.put("/CancelProduct/:productId", auth,isUser, CancelProduct)
router.put("/ReturnProduct/:productId", auth,isUser, ReturnProduct)
router.get("/getProductProgress/:productID", auth,isUser, getProductProgress)
router.get("/getAllBoughtProducts", auth, isUser, getAllBoughtProducts)
router.get("/getUsersOfProduct/:productId", auth,getUsersOfProduct)

module.exports = router;






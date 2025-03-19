import { useEffect } from "react"
import "./App.css"
// Redux
import { Provider, useDispatch, useSelector } from "react-redux"
// React Router
import { Route, Routes, useNavigate } from "react-router-dom"



// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import UpdatePassword from "./pages/UpdatePassword"
import VerifyEmail from "./pages/VerifyEmail"
import ForgotPassword from "./pages/ForgotPassword"

import About from "./pages/About"
import Contact from "./pages/Contact"
import Catalog from "./pages/Catalog"

import Dashboard from "./pages/Dashboard"
import Error from "./pages/Error"

import ServiceDetails from "./pages/ServiceDetails"
import RentDetails from "./pages/RentDetails"
import ProductDetails from "./pages/ProductsDetails"

import ServiceBook from "./pages/ServiceBook"
import RentBook from "./pages/RentBook"

// Components
import Navbar from "./components/Common/Navbar"

import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"

//import MyHistory from "./components/core/Dashboard/UserDashboard"
//import Cart from "./components/core/Dashboard/Cart"
import MyProfile from "./components/core/Dashboard/MyProfile"
import Settings from "./components/core/Dashboard/Settings"


import AddCategory  from "./components/core/Dashboard/AdminDashboard/addCategory"
import MyCategories from "./components/core/Dashboard/AdminDashboard/myCategories"
import EditCategory from "./components/core/Dashboard/ProviderDashboard/Edit/indexCategory" //<------------

// import ProviderStat from "./components/core/Dashboard/ProviderDashboard/ProviderStat"
// import MyServices from "./components/core/Dashboard/ProviderDashboard/MyServices"

import ProviderStat from "./components/core/Dashboard/ProviderDashboard/ProviderStat"
import ServiceStats from "./components/core/Dashboard/ProviderDashboard/ProviderStat/ServiceStats"
import RentalStats from "./components/core/Dashboard/ProviderDashboard/ProviderStat/RentalStats"

import View from "./components/core/Dashboard/ProviderDashboard/View"
import ManageServiceOffering from "./components/core/Dashboard/ProviderDashboard/View/ManageServiceOffering"
import ManageRentOffering from "./components/core/Dashboard/ProviderDashboard/View/ManageRentOffering"

import Edit from "./components/core/Dashboard/ProviderDashboard/Edit/Edit"


import Add from "./components/core/Dashboard/ProviderDashboard/Add"
import AddService from "./components/core/Dashboard/ProviderDashboard/Add/AddService/index"
import AddRentItem from "./components/core/Dashboard/ProviderDashboard/Add/AddRentItem/index"
import AddProduct from "./components/core/Dashboard/ProviderDashboard/Add/AddProduct" 

import WishlistView from "./components/core/Dashboard/UserDashboard/WishlistView"
import HistoryView from "./components/core/Dashboard/UserDashboard/HistoryView"

import { getUserDetails } from "./services/operations/profileAPI"
import { ACCOUNT_TYPE } from "./utils/constants"
import Search from "./pages/Search"

export default function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="search/:searchName" element={<Search />} />

        <Route path="services/:serviceId" element={<ServiceDetails />} />
        <Route path="rents/:rentId" element={<RentDetails />} />
        <Route path="products/:productId" element={<ProductDetails />} />
       
        <Route path="services/:serviceId/book-service" element={<ServiceBook />} />
        <Route path="rents/:rentId/book-rentItem" element={<RentBook />} />
       
        {/* Open Route - for Only Non Logged in User */}
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        {/* Private Route - for Only Logged in User */}
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
        
          {/* Route for all users */}
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />
      
          {/* Route only for Providers */}
          {user?.accountType === ACCOUNT_TYPE.PROVIDER && (
            <>
                
                <Route path="/dashboard/provider" element={<ProviderStat/>} />
                <Route path="/dashboard/providerstats/services" element={<ServiceStats />} />
                <Route path="/dashboard/providerstats/rentals"  element={<RentalStats/>}  />
 
                <Route path="dashboard/my-service/:serviceId" element={<ManageServiceOffering />} />
                <Route path="dashboard/my-rent/:rentId" element={<ManageRentOffering />} />
                <Route path="/dashboard/my-services" element={<View type={"service"}/>} />
                <Route path="/dashboard/my-rents" element={<View type={"rent"}/>} /> 
                <Route path="/dashboard/my-products" element={<View type={"product"}/>} />

                <Route path="dashboard/edit-service/:id" element={<Edit type={"service"}/>} />
                <Route path="dashboard/edit-rent/:id" element={<Edit type={"rent"}/>} />
          
                {/* //<---------- */}

         
                <Route path="/dashboard/add" element={<Add />} />
                <Route path="/dashboard/add-service" element={<AddService />} />
                <Route path="/dashboard/add-rent" element={<AddRentItem />} />
                <Route path="/dashboard/add-product" element={<AddProduct/> } />

                {/* <Route path="/dashboard/edit-product/:id" element={<EditProduct/>} />  */}
               
            </>
          )}
              {/* Route only for Students */}
              {user?.accountType === ACCOUNT_TYPE.USER && (
            <>
                {/* <Route path="dashboard/my-history" element={<MyHistory />} /> */}
                {/* <Route path="/dashboard/cart" element={<Cart />} /> */}

                       
                <Route path="/dashboard/wishlist/services" element={<WishlistView type={"services"}/>} />
                <Route path="/dashboard/wishlist/rents" element={<WishlistView type={"rents"}/>} />
                <Route path="/dashboard/wishlist/products" element={<WishlistView type={"products"}/>} />

                <Route path="/dashboard/history/services" element={<HistoryView type={"services"}/>} />
                <Route path="/dashboard/history/rents" element={<HistoryView type={"rents"}/>} />
                <Route path="/dashboard/history/products" element={<HistoryView type={"products"}/>} />

            </>
          )}

          {/* Route only for Admins */}
           {user?.accountType === ACCOUNT_TYPE.ADMIN && (
            <>
              <Route path="/dashboard/add-category" element={<AddCategory />} />
              <Route path="/dashboard/my-categories" element={<MyCategories/>} />
              <Route path="/dashboard/edit-category/:id" element={<EditCategory/>} />
            </>
          )} 
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  )
}
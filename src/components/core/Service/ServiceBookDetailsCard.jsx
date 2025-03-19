import React, { useState, useEffect } from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./ServiceBookDetailsCard.css"; // Assuming you have a CSS file for this component

import { setWishlist } from "../../../slices/wishlist";
import { ACCOUNT_TYPE } from "../../../utils/constants";

import { addServiceToWishlist, removeServiceFromWishlist,fetchWishList } from "../../../services/operations/wishlistAPI";

function ServiceBookDetailsCard({ handleBookService }) {
  const { service } = useSelector((state) => state.service);
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist) || { services: [], rents: [] }; // Default to empty arrays if wishlist is undefined
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ensure service object and properties are defined
  const {
    thumbnail: ThumbnailImage = "",
    price: CurrentPrice = "",
    _id: serviceId = "",
    instructions = [],
  } = service || {};

  // Check if the service is already in the wishlist
  // useEffect(() => {
  //   console.log("user:",user)
  //   if (user && user?.wishlist) {
  //     console.log(user?.wishlist?.services)
  //     dispatch(setWishlist(user?.wishlist));
  //   }
  // }, [user, dispatch]);

  useEffect(() => {
    (async () => {
      try {
        console.log("user Id : ",user?._id)
        const res = await fetchWishList(user._id,token);
        console.log("Before making  fetch wishlist call", wishlist);
        console.log("fetch wishlist responce: ", res);
       // setResponse(res);
        dispatch(setWishlist(res)); // Correctly dispatch the action
      
      } catch (error) {
        console.log("Could not fetch Service Details", error);
      }
    })();
  }, [user, dispatch]);



  useEffect(() => {
    console.log("service id :",serviceId)
    console.log(wishlist)
    console.log(wishlist &&wishlist?.services?.some((item) => item === serviceId))
    if (wishlist && wishlist?.services?.some((item) => item._id === serviceId)) {
      console.log("making it as true");
      setIsHeartFilled(true);
    }
  }, [wishlist, serviceId]);

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const handleHeartClick = async () => {
    if (user && user?.accountType === ACCOUNT_TYPE.PROVIDER) {
      toast.error("You are a Provider.");
      return;
    }
    if (token) {
      if (!isHeartFilled) {
        setAnimate(true);
        setTimeout(() => {
          setAnimate(false);
        }, 1000);

        try {
          setLoading(true);
          const res = await addServiceToWishlist({ userId: user._id, serviceId: service._id }, token);
          setLoading(false);
          dispatch(setWishlist(res));
          toast.success("Added to wishlist!");
          setIsHeartFilled(true);
        } catch (error) {
          setLoading(false);
          console.error("Adding to wishlist failed:", error);
          toast.error("Adding to wishlist failed. Please try again.");
        }
      } else {
        try {
          setLoading(true);
          const res = await removeServiceFromWishlist({ userId: user._id, serviceId: service._id }, token);
          setLoading(false);
          dispatch(setWishlist(res));
          toast.success("Removed from wishlist!");
          setIsHeartFilled(false);
        } catch (error) {
          setLoading(false);
          console.error("Removing from wishlist failed:", error);
          toast.error("Removing from wishlist failed. Please try again.");
        }
      }
    } else {
      toast.error("Please log in to manage your wishlist.");
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5">
      <img
        src={ThumbnailImage}
        alt={service?.serviceName}
        className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
      />
      <div className="px-4">
        <div className="space-x-3 pb-4 text-3xl font-semibold">
          Rs. {CurrentPrice}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button className="yellowButton w-10/12" onClick={handleBookService}>
              Book Now
            </button>
            <div className="relative flex items-center justify-center">
              <button
                className="relative flex items-center justify-center"
                onClick={handleHeartClick}
              >
                <FaHeart
                  size={30}
                  className={`transition duration-300 ${
                    isHeartFilled ? "text-pink-200" : "text-white"
                  }`}
                />
              </button>
              {animate && (
                <div className="heart-animation">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="heart-particle" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
            30-Day Money-Back Guarantee
          </p>
        </div>
        <div>
          <p className="my-2 text-xl font-semibold">This Service Includes:</p>
          <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
            {instructions.map((item, i) => (
              <p className="flex gap-2" key={i}>
                <BsFillCaretRightFill />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="text-center">
          <button
            className="mx-auto flex items-center gap-2 py-6 text-yellow-100"
            onClick={handleShare}
          >
            <FaShareSquare size={15} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceBookDetailsCard;

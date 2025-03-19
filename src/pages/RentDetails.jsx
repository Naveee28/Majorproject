import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { ACCOUNT_TYPE } from "../utils/constants";
import ConfirmationModal from "../components/Common/ConfirmationModal";
import RentItemReviewModel from "../components/core/Rentals/RentItemReviewModel"
import Footer from "../components/Common/Footer";
import RentReviewSlider  from "../components/Common/RentReviewSlider"
import RatingStars from "../components/Common/RatingStars";
import RentItemBookDetailsCard from "../components/core/Rentals/RentItemBookDetailsCard";
import { formatDate } from "../services/formatDate";
import { fetchRentItemDetails } from "../services/operations/rentDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import Error from "./Error";
import { setRent } from "../slices/rentSlice"; // Import the action creator

export default function RentDetails() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);
  const { rent ,enableWriteReview} = useSelector((state) => state.rent);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { rentId } = useParams();

  //const [response, setResponse] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        localStorage.setItem("previousPage", window.location.href);
        const res = await fetchRentItemDetails(rentId);
        console.log("Before setting Service details in Details Page ", rent);
        console.log("service details response from server in Details page: ", res);
       // setResponse(res);
        dispatch(setRent(res)); // Correctly dispatch the action
      
      } catch (error) {
        console.log("Could not fetch Service Details", error);
      }
    })();
  }, [rentId, dispatch]);

  // Ensure you handle null or loading state properly in your component render logic


  useEffect(() => {
    const count = GetAvgRating(rent?.ratingAndReviews);
    setAvgReviewCount(count);
  }, [rent]);

  if (loading && !rent ) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!rent  ) {
    console.log(rent);
    console.log("error is from here because of no response");
    return <Error />;
  }

  const {
    _id,
    name,
    description,
    thumbnail,
    price,
    whatYouWillLearn,
    ratingAndReviews,
    provider,
    Since,
  } = rent;

  console.log("After setting Service details in Details Page ", rent);
  
  const handleBookRentItem = () => {
    if (!token) {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to Book Rent Item.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
      return;
    }

    if (user?.accountType === ACCOUNT_TYPE.PROVIDER) {
      toast.error("You are a Provider. You can't book a service.");
      return;
    }

    navigate("book-rentItem");
  };

  return (
    <>
      <div className={`relative w-full bg-richblack-800`}>
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="rentItem thumbnail"
                className="aspect-auto w-full"
              />
            </div>
            <div
              className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
            >
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  {name}
                </p>
              </div>
              <p className={`text-richblack-200`}>{description}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>{`(${ratingAndReviews.length} reviews)`}</span>
              </div>
              <div>
                <p className="">
                  Renting By {`${provider.firstName} ${provider.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> Created at {formatDate(Since)}
                </p>
              </div>
            </div>
          </div>
          <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute lg:block">
            <RentItemBookDetailsCard
               handleBookRentItem={handleBookRentItem}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <div className="mt-5">
              <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
            </div>
          </div>
          <div className="mb-12 py-4">
            <p className="text-[28px] font-semibold">Author</p>
            <div className="flex items-center gap-4 py-4">
              <img
                src={
                  provider.image
                    ? provider.image
                    : `https://api.dicebear.com/5.x/initials/svg?seed=${provider.firstName} ${provider.lastName}`
                }
                alt="Author"
                className="h-14 w-14 rounded-full object-cover"
              />
              <p className="text-lg">{`${provider.firstName} ${provider.lastName}`}</p>
            </div>
            <p className="text-richblack-50">
              {provider?.additionalDetails?.about}
            </p>
          </div>
        </div>
      </div>
      <div className="relative mx-auto my-10 flex flex-col w-11/12 max-w-maxContent  items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
       
      </div>
      <div className="w-11/12 mx-10">
      <RentReviewSlider rentItemId={rentId}/>
      </div>
     
      <Footer />
      {enableWriteReview && <RentItemReviewModel />}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}

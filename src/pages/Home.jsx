import React, { useRef } from "react";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";
import "../App.css";
import Footer from "../components/Common/Footer";
import ReviewSlider from "../components/Common/ReviewSlider";
import CTAButton from "../components/core/HomePage/Button";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import Recommentations from "../components/core/HomePage/Recommentations";
import HighlightText from "../components/core/HomePage/HighlightText";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import TimelineSection from "../components/core/HomePage/Timeline";
import { ImagesObject } from "../data/categories-home";
import { ImagesObject1 } from "../data/categories-home";
import bussinesImg from '../assets/Images/business-home.jpeg';
import toast from "react-hot-toast";
import { categories } from "../services/apis";
import { BiCategory } from "react-icons/bi";
import { BiSearch } from "react-icons/bi"
function Home() {

  const rentalsRef = useRef(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleScrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavigate = (link) => {
    navigate(link);
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/search/${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div>
      
      {/* Section 1 */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-12 text-white">
        <div className="w-11/12 max-w-maxContent mx-auto mt-10 flex gap-x-12 items-center justify-center">
         {/* Become a Provider Button */}
         <Link to={"/signup"}>
          <div className="group mx-auto mt-auto w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become a Provider</p>
              <FaArrowRight />
            </div>
          </div>
         </Link>
        {/* Search Bar Section */}
         <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search for services, rentals, and more..."
            className="w-full p-3 pl-10 rounded-lg text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <BiSearch className="absolute left-3 top-1/3  transform-translate-y-1/2 text-black text-black-500  text-xl" />
         </div>
        
        </div>
        {/* Heading */}
        <div className="mt-4 text-center text-4xl font-semibold">
          Begin your 
          <HighlightText text={"Enterprise "} />
          or Address your 
          <HighlightText text={"Requirements"} />
          .
        </div>
        {/* Sub Heading */}
        <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our platform, you can effortlessly access and provide products, services, and rental items, all while enjoying a seamless experience that includes comprehensive listings, user reviews, and real-time support from our dedicated team.
        </div>
        {/* Section with Images */}
        <div className="flex lg:flex-row my-10 justify-between flex-col lg:gap-6 gap-2">
          {/* Left side */}
          <div className="bg-opacity-1 lg:w-[60%] w-[100%] h-70 ml-5 flex flex-col gap-8 p-5 border rounded border-l-caribbeangreen-5 bg-image-box bg-cover relative">
            <img
              src={bussinesImg}
              alt="Business Image"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="z-10 text-4xl text-caribbeangreen-900 font-semibold">
              Have a <HighlightText text={"Business"} />?
            </div>
            <div className="z-10 text-richblack-300 text-base font-bold w-[85%] -mt-3">
              "Start Selling With Us in 1 min"
            </div>
            <div className="z-10 flex gap-7 mt-7">
              <CTAButton active="true" linkto="/signup">
                <div className="flex items-center gap-2">
                  Register Now <FaArrowRight />
                </div>
              </CTAButton>
            </div>
          </div>
          {/* Right side */}
          <div className="lg:w-[40%] w-[100%] flex flex-row justify-center mr-5 gap-4 h-86">
            {ImagesObject1.map((image, index) => (
              <div
                key={index}
                className="w-64 md:min-h-full border border-l-caribbeangreen-5 bg-cover bg-center bg-image-box flex justify-center text-caribbeangreen-900 text-xl font-bold shadow-lg rounded-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  toast.success("select a Category");
                  handleScrollToSection(rentalsRef);
                   }}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out text-white text-center py-2">
                  {image.title}
                </div>
              </div>
            ))}
          </div>
        </div>
        
         {/* Services Section */}
         <div ref={rentalsRef} className="flex flex-row lg:w-100% flex-wrap justify-between mb-4 gap-1">
          {ImagesObject.map((image, index) => (
            <div 
              key={index} 
              className="lg:w-1/10 md:w-3/6 group flex flex-col justify-center items-center p-4 rounded-full bg-image-box cursor-pointer"
              onClick={() => handleNavigate(image.link)}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-5/6 h-5/6 items-center justify-center object-cover group-hover:border-4 rounded"
              />
              <p className="text-center mt-2">{image.title}</p>
            </div>
          ))}
        </div>
        {/* recommentations for servies and retals */}
        <Recommentations />
        
        {/* Explore Section */}
        <ExploreMore />
      </div>
      {/* Section 2 */}
      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="homepage_bg h-[320px]">
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/login"}>
                Find your Need
              </CTAButton>
            </div>
          </div>
        </div>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%]">
              Get the services you need to {" "}
              <HighlightText text={"get your work done."} />
            </div>
            <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className="text-[16px]">
                The modern QuickService dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div className="">Learn More</div>
              </CTAButton>
            </div>
          </div>
          <TimelineSection />
          <LearningLanguageSection />
        </div>
      </div>
      {/* Section 3 */}
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <InstructorSection />
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other Customers
        </h1>
      </div>
      <div className="w-11/12 mx-10">
        <ReviewSlider />
      </div>
      <Footer />
    </div>
  );
}

export default Home;

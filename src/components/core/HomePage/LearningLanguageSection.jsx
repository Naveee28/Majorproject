import React from 'react'
import HighlightText from './HighlightText'
import CTAButton from "../../../components/core/HomePage/Button";
import product_progress from "../../../assets/Images/product-status-home.jpg";
import service_progress from "../../../assets/Images/service-status-home.jpg";
import rent_progress from "../../../assets/Images/rent-progress-home.png";

const LearningLanguageSection = () => {
  return (
    <div className="text-4xl flex flex-col items-center justify-center font-semibold text-center my-10">
      Your ultimate tool for accessing 
      <HighlightText text={" products, services, and rental items."} />
      <div className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
        Unlock a world of possibilities with our platform, offering a diverse range of products, services, and rental items tailored to your needs. Experience seamless transactions, comprehensive progress tracking, personalized schedules, and more, all designed to simplify your journey to success.
      </div>

      <div className="relative  mt-10  w-[90%] h-[60vh] ">
        {/* First Image */}
        <img
          src={product_progress}
          alt="First Image"
          className="absolute top-0 left-0 rounded-2xl bg-image-box "
          style={{ width: '460px', height : '300px', zIndex: '3' }}
        />
 
        {/* Second Image */}
        <img
          src={service_progress}
          alt="Second Image"
          className="absolute top-64 right-96 rounded-2xl shadow-blue-200 shadow-[0px_0px_30px_0px]  bg-image-box"
          // transform translate-x-1/4 translate-y-1/4
          style={{ width: '400px', height : '300px', zIndex: '2' }}
        />

        {/* Third Image */}
        <img
          src={rent_progress}
          alt="Third Image"
          className="absolute top-0 right-0 rounded-2xl bg-image-box"
          style={{ width: '470px', height : '300px', zIndex: '3' }}
        />
      </div>

      <div className="w-fit mx-auto lg:mb-20 mb-8 mt-40">
        <CTAButton active={true} linkto={"/signup"}>
          <div className="">Learn More</div>
        </CTAButton>
      </div>
    </div>
  )
}

export default LearningLanguageSection

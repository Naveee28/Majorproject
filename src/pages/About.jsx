import React from "react"

import FoundingStory from "../assets/Images/FoundingStory.png"
import BannerImage1 from "../assets/Images/aboutus2.jpg"
import BannerImage2 from "../assets/Images/aboutus4.jpg"
import BannerImage3 from "../assets/Images/aboutus3.jpg"
import Footer from "../components/Common/Footer"
import ReviewSlider from "../components/Common/ReviewSlider"
import ContactFormSection from "../components/core/AboutPage/ContactFormSection"
import LearningGrid from "../components/core/AboutPage/LearningGrid"
import Quote from "../components/core/AboutPage/Quote"
import StatsComponenet from "../components/core/AboutPage/Stats"
import HighlightText from "../components/core/HomePage/HighlightText"

const About = () => {
  return (
    <div>
      <section className="bg-richblack-700">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
          <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
          Redefining Rentals and Services for 
            <HighlightText text={"Effortless Access and Convenience"} />
            <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
            ServiceXRentals revolutionizes rentals and services by connecting users with providers on a simple, efficient platform, making booking and managing services easier than ever.
            </p>
          </header>
          <div className="sm:h-[70px] lg:h-[150px]"></div>
          <div className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
            <img src={BannerImage1} alt="" />
            <img src={BannerImage2} alt="" />
            <img src={BannerImage3} alt="" />
          </div>
        </div>
      </section>

      <section className="border-b border-richblack-700">
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="h-[100px] "></div>
          <Quote />
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[50%] flex-col gap-10">
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Founding Story
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
              Our serviceXrentals platform was born out of a shared vision and passion for transforming the way services and rentals are managed and accessed. It all began with a team of industry experts, technology enthusiasts, and customer service advocates who recognized the need for a streamlined, user-friendly solution in a growing rental market.
              </p>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
              As service providers ourselves, we experienced firsthand the limitations of traditional rental and service booking systems. We believed these services shouldn’t be complicated by cumbersome processes or restricted by location. We envisioned a platform that would bridge these gaps, providing users and providers alike with an efficient, accessible, and dynamic way to manage and book rentals and services.
              </p>
            </div>

            <div>
              <img
                src={FoundingStory}
                alt=""
                className="shadow-[0_0_20px_0] shadow-[#FC6767]"
              />
            </div>
          </div>
          <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Vision
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
              With this vision in mind, we set out to create a platform that would revolutionize the service and rental industry. Our team of dedicated experts worked tirelessly to develop a robust and intuitive system that combines state-of-the-art technology with user-centered design, providing a seamless and efficient experience for both users and providers. Through this platform, we aim to make service and rental bookings straightforward, accessible, and enjoyable for everyone involved.
              </p>
            </div>
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
              Our Mission
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
              Our mission extends beyond simply offering a platform for booking services and rentals. We strive to cultivate a dynamic community where users and providers can connect, share experiences, and learn from one another. We believe that meaningful connections and shared insights are key to enhancing service quality and customer satisfaction. To foster this spirit, we encourage active engagement through user reviews, feedback systems, and community forums that allow open dialogue and collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsComponenet />
      <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
        <LearningGrid />
        <ContactFormSection />
      </section>

      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other Customers
        </h1>
       
      </div>
      <ReviewSlider />
      <Footer />
    </div>
  )
}

export default About

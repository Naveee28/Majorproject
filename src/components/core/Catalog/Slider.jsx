import React, { useEffect, useState } from "react"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
// import "../../.."
// Import required modules
import { FreeMode, Pagination } from "swiper"

// import { getAllCourses } from "../../services/operations/courseDetailsAPI"
import Card from "./Card"

function Slider({ Items,type }) {
  return (
    <>
      {Items?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          modules={[FreeMode, Pagination]}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem]"
        >
          {Items?.map((item, i) => (
            <SwiperSlide key={i}>
              <Card Item={item} Height={"h-[250px]"} type={type} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Iems Found</p>
      )}
    </>
  )
}

export default Slider

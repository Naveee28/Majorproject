import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
//import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"

// import CourseCard from "../components/Catalog/CourseCard"
// import CourseSlider from "../components/Catalog/CourseSlider"

import Card from "../../core/Catalog/Card"
import Slider from "../Catalog/Slider"
import {getRecommendDataDetails } from "../../../services/operations/categoryDetailsAPI"


function Recommentations() {
  const { loading } = useSelector((state) => state.profile)
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  console.log("user Id : ",user?._id)
  const [active, setActive] = useState(1)
  const [recommendData, setRecommendData] = useState(null)

  //Fetch All Categories and find category id 

  useEffect(() => {
    ;(async () => {
      try {
        console.log("searching recommend data started")
        const res = await getRecommendDataDetails(user?._id,token);
        setRecommendData(res?.data)
       // console.log("recommendData",recommendData);
        console.log("res:",res);
      } catch (error) {
        console.log(error)
      }
    })()
  }, [user?._id])

  useEffect(() => {
    console.log("Updated recommendData:", recommendData);
  }, [recommendData]);

//   if (loading || !catalogPageData) {
//     return (
//       <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
//         <div className="spinner"></div>
//       </div>
//     )
//   }
  if (!loading && !recommendData) {
    return <></>
  }

  return (
    <>
 

      {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Perks you're looking for</div>
        {/* <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Populer
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div> */}
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
         Services 
        </div>
        <div className="py-8">
          <Slider
            Items={recommendData?.services}
            type={"services"}
          />
        </div>
      </div>
        {/* Section 2
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
         Products in {catalogPageData?.data?.selectedCategory?.name}
        </div>
        <div className="py-8">
          <Slider
            Items={catalogPageData?.data?.selectedCategory?.products}
            type={"rents"}
          />
        </div>
      </div> */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Rentals 
        </div>
        <div className="py-8">
          <Slider
            Items={recommendData?.rents}
            type={"rents"}
          />
        </div>
      </div>
      
      </div>
    
      

      {/* Section 3
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {catalogPageData?.data?.mostSellingCourses
              ?.slice(0, 4)
              .map((item, i) => (
                <Card Item={item} key={i} Height={"h-[400px]"} />
              ))}
          </div>
        </div>
      </div> */}

      
    </>
  )
}

export default Recommentations

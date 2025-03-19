import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

// import CourseCard from "../components/Catalog/CourseCard"
// import CourseSlider from "../components/Catalog/CourseSlider"
import Footer from "../components/Common/Footer"
import Card from "../components/core/Catalog/Card"
import Slider from "../components/core/Catalog/Slider"

import { getSearchPageDetails } from "../services/operations/categoryDetailsAPI"
import Error from "./Error"

function Search() {
  const { loading } = useSelector((state) => state.profile)
  const { user } = useSelector((state) => state.profile)

  const { searchName } = useParams()
  const [active, setActive] = useState(1)
  const [searchPageData, setSearchPageData] = useState(null)
   

  useEffect(() => {
    ;(async () => {
      try {
        console.log("searching started",searchName)
        console.log(user?._id);
        const res = await getSearchPageDetails(searchName,user?._id);
        setSearchPageData(res);
      } catch (error) {
        console.log(error)
      }
    })()
  }, [searchName])


  if (loading || !setSearchPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!loading && (!setSearchPageData  )) {
    return <Error />
  }

  return (
    <>
      {/* Hero Section */}
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[20px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
      
          {/* <p className="text-3xl text-richblack-5">
           Search Results For  
           <span className="text-3xl text-yellow-25">
           {searchName}
            </span>
          </p> */}
       
        </div>
      </div>

      {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Perks you're looking for</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
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
        </div>
        <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
         Services in {searchName}
        </div>
        <div className="py-8">
          <Slider
            Items={searchPageData?.services}
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
          Rentals in {searchName}
        </div>
        <div className="py-8">
          <Slider
            Items={searchPageData?.rents}
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

      <Footer />
    </>
  )
}

export default Search

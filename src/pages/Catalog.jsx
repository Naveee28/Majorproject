import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

// import CourseCard from "../components/Catalog/CourseCard"
// import CourseSlider from "../components/Catalog/CourseSlider"
import Footer from "../components/Common/Footer"
import Card from "../components/core/Catalog/Card"
import Slider from "../components/core/Catalog/Slider"
import { apiConnector } from "../services/apiConnector"
import { categories } from "../services/apis"
import { getCategoryPageDetails } from "../services/operations/categoryDetailsAPI"
import Error from "./Error"

function Catalog({type}) {
  const { loading } = useSelector((state) => state.profile)

  const { catalogName } = useParams()

  const [active, setActive] = useState(1)
  const [catalogPageData, setCatalogPageData] = useState(null)
  const [categoryId, setCategoryId] = useState("")


  useEffect(() => {
    ;(async () => {
      try {
        const res = await apiConnector("GET", categories.FETCH_CATEGORIES_API)
        const category_id = res?.data?.data?.filter(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
        )[0]._id
        setCategoryId(category_id)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
    })()
  }, [catalogName])

  useEffect(() => {
    if (categoryId) {
      ;(async () => {
        try {
          const res = await getCategoryPageDetails(categoryId)
          setCatalogPageData(res)
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [categoryId])

  if (loading || !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!loading && (!catalogPageData.success  )) {
    return <Error />
  }

  return (
    <>
      {/* Hero Section */}
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Perks to get you started</div>
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
         Services in {catalogPageData?.data?.selectedCategory?.name}
        </div>
        <div className="py-8">
          <Slider
            Items={catalogPageData?.data?.selectedCategory?.services}
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
          Rentals in {catalogPageData?.data?.selectedCategory?.name}
        </div>
        <div className="py-8">
          <Slider
            Items={catalogPageData?.data?.selectedCategory?.rents}
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

export default Catalog

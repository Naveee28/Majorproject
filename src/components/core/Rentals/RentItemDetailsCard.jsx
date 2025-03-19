import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare ,FaArrowCircleLeft} from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"



function RentItemDetailsCard() {
  
  const { rent } = useSelector((state) => state.rent)
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: _id,
    provider,
    name
  } = rent

  console.log("Service details in the Service details Card  ",rent)


 const handleKnowMore = () => {
    const previousPage = localStorage.getItem("previousPage");
    if (previousPage) {
      navigate(previousPage, { replace: true });
    } else {
      navigate(-1); // Fallback to go back if no previous page is stored
    }
  };

  const handleShare = () => {
    const previousPage = localStorage.getItem("previousPage");
    copy(previousPage)
    toast.success("Link copied to clipboard")
  }


  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
      >
        {/* Course Image */}
        <img
          src={ThumbnailImage}
          alt={rent?.rentName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
        <div>
                <p className="text-3xl font-semibold text-richblack-5 sm:text-[42px]">
                  {name}
                </p>
        </div>

        <div>
                <p className="">
                  Service By {`${provider.firstName} ${provider.lastName}`}
                </p>
        </div>
               
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            Rs. {CurrentPrice}
          </div>
      
          <div>
            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
              30-Day Money-Back Guarantee
            </p>
          </div>

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              This Rent Item Includes :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {rent?.instructions?.map((item, i) => {
                return (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                )
              })}
            </div>
          </div>
          
          <div className="text-center flex flex-row">
          <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleKnowMore}
            >
              <FaArrowCircleLeft size={15} /> Know More
            </button>
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default RentItemDetailsCard

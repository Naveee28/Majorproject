import React, { useEffect, useState } from "react"
// Icons
import { FaRegStar, FaStar } from "react-icons/fa"
import ReactStars from "react-rating-stars-component"
import { Link } from "react-router-dom"

import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../Common/RatingStars"

function Card({ Item, Height ,type }) {
  // const avgReviewCount = GetAvgRating(course.ratingAndReviews)
  // console.log(course.ratingAndReviews)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(Item.ratingAndReviews)
    setAvgReviewCount(count)
  }, [Item])
  // console.log("count............", avgReviewCount)

  return (
    <>
      <Link to={`/${type}/${Item._id}`}>
        <div className="">
          <div className="rounded-lg">
            <img
              src={Item?.thumbnail}
              alt="course thumnail"
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{Item?.courseName}</p>
            <p className="text-sm text-richblack-50">
              {Item?.instructor?.firstName} {Item?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              {/* <ReactStars
                count={5}
                value={avgReviewCount || 0}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaRegStar />}
                fullIcon={<FaStar />}
              /> */}
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {Item?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {Item?.price}</p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default Card

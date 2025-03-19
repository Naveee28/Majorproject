import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchProviderServices } from "../../../../../services/operations/serviceDetailsAPI"
import { getProviderServicesData } from "../../../../../services/operations/profileAPI"
import ProviderChart from "./ProviderChart"

export default function ServiceStats() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [providerData, setProviderData] = useState(null)
  const [services, setServices] = useState([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const providerApiData = await getProviderServicesData({userId : user._id},token)
      const result = await fetchProviderServices({userId : user._id},token)
      console.log(providerApiData)
      if (providerApiData && providerApiData.length) setProviderData(providerApiData)
      if (result) {
        setServices(result)
      }
      setLoading(false)
    })()
  }, [])

  const totalAmount = providerData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  )

  const totalBookings = providerData?.reduce(
    (acc, curr) => acc + curr.bookedSlots,
    0
  )

   console.log(providerData);

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>
      {loading ? (
        <div className="spinner"></div>
      ) : services.length > 0 ? (
        <div>
          <div className="my-4 flex h-[450px] space-x-4">
            {/* Render chart / graph */}
            {totalAmount > 0 || totalBookings > 0 ? (
              <ProviderChart items={providerData} />
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}
            {/* Total Statistics */}
            <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-lg text-richblack-200">Total Services</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {services.length}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Bookings</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {totalBookings}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Income</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    Rs. {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md bg-richblack-800 p-6">
            {/* Render 3 courses */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Services</p>
              <Link to="/dashboard/my-services">
                <p className="text-xs font-semibold text-yellow-50">View All</p>
              </Link>
            </div>
            <div className="my-4 flex items-start space-x-6">
              {providerData.slice(0, 3).map((service) => (
                <div key={service._id} className="w-1/3">
                  <img
                    src={service.thumbnail}
                    alt={service.name}
                    className="h-[201px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50">
                      {service.name}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {service.bookedSlots} Bookings
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        |
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        Rs. {service.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-service">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a service
            </p>
          </Link>
        </div>
      )}
    </div>
  )
}

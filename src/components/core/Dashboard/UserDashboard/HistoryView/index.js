import { VscAdd } from "react-icons/vsc"
import { useNavigate } from "react-router-dom"

import DetailsServiceTable from "./viewServiceDetails"
import DetailsRentTable from "./viewRentDetails"
import IconBtn
 from "../../../../Common/IconBtn"
export default function HistoryView({ type }) {
  const navigate = useNavigate()
  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">Purchase History</h1>
      </div>
      { type==="services" ? (<DetailsServiceTable type={type} /> ) : (<DetailsRentTable type={type} />) }
    </div>
  )
}

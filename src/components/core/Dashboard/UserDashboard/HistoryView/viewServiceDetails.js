import { VscAdd } from "react-icons/vsc"
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { FaCheck,FaTimesCircle } from "react-icons/fa";

import { FaPlus } from 'react-icons/fa'; 
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line,RiCloseLine,RiAddLine } from "react-icons/ri";

import ConfirmationModal from "../../../../Common/ConfirmationModal";
import IconBtn from "../../../../Common/IconBtn"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import {
  fetchProviderServices,
  deleteService,
} from "../../../../../services/operations/serviceDetailsAPI";
import {
  getAllProductsOfProvider,
  deleteProduct,
} from "../../../../../services/operations/productDetailsAPI";
import {
  getAllRentItemsOfProvider,
  deleteRentItem,
} from "../../../../../services/operations/rentDetailsAPI";

import { formatDateOnly } from "../../../../../services/formatDateOnly";
import Tab from "../../../../Common/Tab";
import { fetchServicesBookedByUser,cancelServiceSlot} from "../../../../../services/operations/serviceDetailsAPI";
import { setWriteReview,setService } from "../../../../../slices/serviceSlice";
const tabData = [
  { id: 1, tabName: "Services", link: "/dashboard/history/services", type: "services" ,action : "Serve"},
  // { id: 2, tabName: "Products", link: "/dashboard/my-products", type: "product" },
  { id: 2, tabName: "Rents", link: "/dashboard/history/rents", type: "rents" },
];

export default function DetailsServiceTable({ type }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth);
  const {service } = useSelector((state)=> state.service);
  const { wishlist } = useSelector((state) => state.wishlist) || { services: [], rents: [] }; // Default to empty arrays if wishlist is undefined
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const modifiedType = type.slice(0, -1);

   const fetchData = async () => {
      try {
        console.log("user Id : ",user?._id)
        const res = await fetchServicesBookedByUser({userId : user._id},token);
        console.log("Before making  fetch History call",data);
        console.log("fetch History responce: ", res);
       // setResponse(res);n
        setData(res)
      } catch (error) {
        console.log("Could not fetch Service Details", error);
      }
    }
  // useEffect(() => {
  //   fetchData();
  // }, [type, token,user]);

  
  useEffect(() => {
    fetchData();
  }, [user, dispatch]);

  const handleCancel = async (slotId,serviceId) => {
    setLoading(true);
    if (type === "services") {
      await cancelServiceSlot({serviceId:serviceId ,slotId:slotId,userId: user._id}, token);
    // } else if (type === "product") {
    //   await cancelProduct(id, token);
    // } else if (type === "rent") {
    //   await cancelRentItem(id, token);
    // }
    }
    await fetchData();
    setConfirmationModal(null);
    setLoading(false);
  };

  const handleWriteReview = async (service)=>{
    dispatch(setService(service));
    dispatch(setWriteReview(true));
    navigate(`/${type}/${service._id}`)
  }

  return (
    <>
      <Tab
        tabData={tabData}
        field={type}
        setField={(newType) =>
          navigate(tabData.find((tab) => tab.type === newType)?.link || "/")
        }
      />
      <Table className="rounded-xl border border-richblack-800">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Name
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data && data.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No items found
              </Td>
            </Tr>
          ) : ( data && 
            data.map((item) => (
              <Tr
                key={item._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
              >
               <Td className="flex flex-1 gap-x-4" >
               {/* ,{ state: { isProvider: user.accountType === ACCOUNT_TYPE.PROVIDER } } */}
                    <img
                       src={item?.service?.thumbnail}
                         alt={item?.service?.name}
                         className="h-[148px] w-[220px] rounded-lg object-cover"
                     />
                      <div className="flex flex-col justify-between">
                        <p className="text-lg font-semibold text-richblack-5">
                         {item?.service?.name}
                        </p>
                         <p className="text-xs text-richblack-300">
                           {item?.service?.description}
                            </p>
                        <p className="text-[12px] text-white">
                        {modifiedType} on: {formatDateOnly(item?.date)} | {item?.slot?.startTime} - {item?.slot?.endTime}
                        </p> 
                        {item?.slot?.progress === "Completed" ? (
                          <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                         <HiClock size={14} />
                            Completed
                            </p>
                             ) : (
                              <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                                 <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                                 <FaCheck size={8} />
                                   </div>
                                    {item?.slot?.progress}
                                     </p>
                                  )}                   
                    </div>
                </Td>

                <Td className="text-sm font-medium text-richblack-100">
                  ₹{item?.service?.price}
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                {item?.slot?.progress !== "Completed" ? (
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: `Do you want to Cancel this ${type}?`,
                        text2: `Your'e missing an amazing ${type} `,
                        btn1Text:"Withdraw",
                        btn2Text: !loading ? "Continue..." : "Loading...",
                        btn1Handler: !loading
                          ? () =>setConfirmationModal(null)
                          : () => {},
                        btn2Handler: !loading
                          ? () => handleCancel(item?._id,item?.service?._id)
                          : () => {},
                      });
                    }}
                    title="Cancel"
                    className="flex flex-row px-1 transition-all duration-200 text-[#e3e65a] hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiCloseLine  size={20} className=""/>Cancel
                  </button>
                 
                ):(
                  <button
                    disabled={loading}
                    onClick={() => handleWriteReview(item?.service)}
                    title="Cancel"
                    className="flex flex-row px-1 transition-all duration-200 text-[#e3e65a] hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiAddLine size={20} className=""/>Add Review
                  </button>
              
                )
                
                }  
               
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
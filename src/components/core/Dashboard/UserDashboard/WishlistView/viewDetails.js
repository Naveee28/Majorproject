import { VscAdd } from "react-icons/vsc"
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";

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

import { formatDate } from "../../../../../services/formatDate";
import Tab from "../../../../Common/Tab";
import { addServiceToWishlist, removeServiceFromWishlist,fetchWishList } from "../../../../../services/operations/wishlistAPI";
import { setWishlist } from "../../../../../slices/wishlist";
const tabData = [
  { id: 1, tabName: "Services", link: "/dashboard/wishlist/services", type: "services" },
  // { id: 2, tabName: "Products", link: "/dashboard/my-products", type: "product" },
  { id: 2, tabName: "Rents", link: "/dashboard/wishlist/rents", type: "rents" },
];

export default function DetailsTable({ type }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist) || { services: [], rents: [] }; // Default to empty arrays if wishlist is undefined
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  // const fetchData = async () => {
  //   console.log("type :", type);
  //   setLoading(true);
  //   let result;
  //   if (type === "service") {
  //     result = user?.wishlist?.services;
  //     console.log(" service Fetch :", result);
    
  //   // } else if (type === "product") {
  //   //   result = await getAllProductsOfProvider(token);
  //   //   console.log(" product Fetch :", result);
  //   } else if (type === "rent") {
  //       result = user?.wishlist?.rents;
  //       console.log(" service Fetch :", result);
  //   }
  //   if (result) {
  //     setData(result);
  //   }
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   fetchData();
  // }, [type, token,user]);

  
  useEffect(() => {
    (async () => {
      try {
        console.log("user Id : ",user?._id)
        const res = await fetchWishList(user._id,token);
        console.log("Before making  fetch wishlist call", wishlist);
        console.log("fetch wishlist responce: ", res);
       // setResponse(res);
        dispatch(setWishlist(res));
        if(type=="rents")
          setData(res?.rents)
        if(type=="services") // Correctly dispatch the action
          setData(res?.services)
      } catch (error) {
        console.log("Could not fetch Service Details", error);
      }
    })();
  }, [user,type, dispatch]);

  // const handleDelete = async (id) => {
  //   setLoading(true);
  //   if (type === "service") {
  //     await deleteService(id, token);
  //   } else if (type === "product") {
  //     await deleteProduct(id, token);
  //   } else if (type === "rent") {
  //     await deleteRentItem(id, token);
  //   }
  //   await fetchData();
  //   setConfirmationModal(null);
  //   setLoading(false);
  // };

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
          {data.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No items found
              </Td>
            </Tr>
          ) : (
            data.map((item) => (
              <Tr
                key={item._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
              >
               <Td className="flex flex-1 gap-x-4" onClick={() => navigate(`/dashboard/my-${type}/${item._id}` )}>
               {/* ,{ state: { isProvider: user.accountType === ACCOUNT_TYPE.PROVIDER } } */}
                    <img
                       src={item?.thumbnail}
                         alt={item?.name}
                         className="h-[148px] w-[220px] rounded-lg object-cover"
                     />
                      <div className="flex flex-col justify-between">
                        <p className="text-lg font-semibold text-richblack-5">
                         {item.name}
                        </p>
                         <p className="text-xs text-richblack-300">
                           {item.description}
                            </p>
                        <p className="text-[12px] text-white">
                                    Created: {formatDate(item.Since)}
                        </p>                    
                    </div>
                </Td>

                <Td className="text-sm font-medium text-richblack-100">
                  ₹{item.price}
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                <IconBtn
                   text="Book Now"
                   onclick={() => navigate(`/${type}/${item._id}`)}
                  >
                 </IconBtn>
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
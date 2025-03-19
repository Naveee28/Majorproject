import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";

import ConfirmationModal from "../../../../Common/ConfirmationModal";
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
  fetchProviderRentItems,
} from "../../../../../services/operations/rentDetailsAPI";

import { formatDate } from "../../../../../services/formatDate";
import Tab from "../../../../Common/Tab";

const tabData = [
  { id: 1, tabName: "Services", link: "/dashboard/my-services", type: "service" },
  // { id: 2, tabName: "Products", link: "/dashboard/my-products", type: "product" },
  { id: 2, tabName: "Rents", link: "/dashboard/my-rents", type: "rent" },
];

export default function DetailsTable({ type }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user} =useSelector((state) => state.profile);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const fetchData = async () => {
    console.log("type :", type);
    setLoading(true);
    let result;
    if (type === "service") {
      result = await fetchProviderServices({userId : user._id},token);
      console.log(" service Fetch :", result);
    } else if (type === "product") {
      result = await getAllProductsOfProvider({userId : user._id},token);
      console.log(" product Fetch :", result);
    } else if (type === "rent") {
      result = await fetchProviderRentItems({userId : user._id},token);
      console.log(" rent Fetch :", result);
    }
    if (result) {
      setData(result);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [type, token]);

  const handleDelete = async (id) => {
    setLoading(true);
    if (type === "service") {
      await deleteService(id, token);
    } else if (type === "product") {
      await deleteProduct(id, token);
    } else if (type === "rent") {
      await deleteRentItem(id, token);
    }
    await fetchData();
    setConfirmationModal(null);
    setLoading(false);
  };

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
               <Td className="flex flex-1 gap-x-4" onClick={() =>  navigate(`/dashboard/my-${type}/${item._id}` )}>
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
                        {item.status === "Draft" ? (
                          <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                         <HiClock size={14} />
                             Drafted
                            </p>
                             ) : (
                              <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                                 <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                                 <FaCheck size={8} />
                                   </div>
                                     Published
                                     </p>
                                  )}
                           </div>
                </Td>

                <Td className="text-sm font-medium text-richblack-100">
                  ₹{item.price}
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-${type}/${item._id}`);
                    }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: `Do you want to delete this ${type}?`,
                        text2: `All the data related to this ${type} will be deleted`,
                        btn1Text: !loading ? "Delete" : "Loading...",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleDelete(item._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      });
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
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
import { useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import IconBtn from "../../../../Common/IconBtn";
import serviceLogo from "../../../../../assets/Logo/serviceLogo.jpg";
import rentLogo from "../../../../../assets/Logo/rentLogo.jpg";
import productLogo from "../../../../../assets/Logo/productLogo.jpg";

export default function Add() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full select-none p-6 bg-richblack-900">
      <div className="flex gap-6">
        {/* Row 1 */}
        <div className="flex-1 bg-gray-600 rounded-md overflow-hidden shadow-lg">
          <div className="p-6 flex items-center justify-center">
            <img
              src={serviceLogo}
              alt="Service Logo"
              className="w-48 h-48 object-cover transition-all duration-200 transform hover:scale-110 shadow-white"
            />
          </div>
          <div className="p-6 flex items-center justify-center">
            <IconBtn
              text={<><VscAdd className="mr-2" />Add Service</>}
              onclick={() => navigate("/dashboard/add-service")}
            >
            </IconBtn>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex-1 bg-gray-600 rounded-md overflow-hidden shadow-lg">
          <div className="p-6 flex items-center justify-center">
            <img
              src={rentLogo}
              alt="Rent Logo"
              className="w-48 h-48 object-cover transition-all duration-200 transform hover:scale-110 shadow-white"
            />
          </div>
          <div className="p-6 flex items-center justify-center">
            <IconBtn
              text={<><VscAdd className="mr-2" />Add Rental Item</>}
              onclick={() => navigate("/dashboard/add-rent")}
            >
            </IconBtn>
          </div>
        </div>

        {/* Row 3 */}
        {/* <div className="flex-1 bg-gray-600 rounded-md overflow-hidden shadow-lg">
          <div className="p-6 flex items-center justify-center">
            <img
              src={productLogo}
              alt="Product Logo"
              className="w-48 h-48 object-cover transition-all duration-200 transform hover:scale-110 shadow-white"
            />
          </div>
          <div className="p-6 flex items-center justify-center">
            <IconBtn
              text={<><VscAdd className="mr-2" />Add Product</>}
              onclick={() => navigate("/dashboard/add-product")}
            >
            </IconBtn>
          </div>
        </div> */}
      </div>
    </div>
  );
}

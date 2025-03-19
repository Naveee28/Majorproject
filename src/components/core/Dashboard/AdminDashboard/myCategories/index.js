import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../../../../../services/apiConnector";
import { categories } from "../../../../../services/apis";
import { VscAdd } from "react-icons/vsc";
import IconBtn from "../../../../Common/IconBtn";
import {fetchAllCategories} from "../../../../../services/operations/categoryDetailsAPI"
export default function MyCategories() {
  const [categoryData, setCategoryData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchAllCategories();
        console.log("result :",res);
        setCategoryData(res);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="relative mb-16 w-full select-none p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-white text-2xl md:text-3xl">Categories</h1>
        <IconBtn
          text="Add Category"
          onclick={() => navigate("/dashboard/add-category")}
        >
          <VscAdd className="mr-2" />
        </IconBtn>
      </div>
      <div className="flex justify-center flex-wrap">
      {categoryData && categoryData.map((category, index) => (
        <div
          key={index} // Use array index as key (not recommended)
          className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 category-tab flex min-w-[130px] flex-col items-center gap-y-2 mx-4 my-2 p-4 transition-all duration-200 transform hover:scale-110 cursor-pointer rounded-lg shadow-lg hover:shadow-xl"
          onClick={() =>
            navigate(
              `/catalog/${category.name.split(" ").join("-").toLowerCase()}`
            )
          }
        >
          <p className="text-base md:text-lg text-white font-normal">
            {category.name}
          </p>
        </div>
      ))}
      
      </div>
    </div>
  );
}


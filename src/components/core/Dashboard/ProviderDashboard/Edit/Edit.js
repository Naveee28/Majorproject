import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// Importing API functions
import { fetchProductDetails } from "../../../../../services/operations/productDetailsAPI";
import { fetchRentItemDetails } from "../../../../../services/operations/rentDetailsAPI";
import { fetchServiceDetails } from "../../../../../services/operations/serviceDetailsAPI";
import { getCategoryDetails } from "../../../../../services/operations/categoryDetailsAPI";

// Importing slices
import { setProduct, setEditProduct } from "../../../../../slices/productSlice";
import { setRent, setEditRent } from "../../../../../slices/rentSlice";
import { setService, setEditService } from "../../../../../slices/serviceSlice";
import { setCategory, setEditCategory } from "../../../../../slices/categorySlice";

// Importing RenderSteps components
import RenderStepsService from "../Add/AddService/RenderSteps";
import RenderStepsRentals from "../Add/AddRentItem/RenderSteps";
import RenderStepsProduct from "../Add/AddProduct/RenderSteps";
import RenderStepsCategory from "../../AdminDashboard/addCategory/RenderSteps";

export default function Edit({ type }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      let result = null;

      try {
        switch (type) {
          case "product":
            result = await fetchProductDetails(id);
            if (result) {
              dispatch(setEditProduct(true));
              dispatch(setProduct(result));
            }
            break;
          case "rent":
            result = await fetchRentItemDetails(id);
            if (result) {
              dispatch(setEditRent(true));
              dispatch(setRent(result));
            }
            break;
          case "service":
            result = await fetchServiceDetails(id);
            if (result) {
              console.log(result)
              dispatch(setEditService(true));
              dispatch(setService(result));
            }
            break;
       
          default:
            toast.error("Invalid type provided");
            setLoading(false);
            return;
        }
        if (!result) {
          toast.error("Details not found");
        }
      } catch (error) {
        toast.error("Failed to fetch details");
        console.error(error);
      }

      setLoading(false);
    };

    fetchDetails();
  }, [type, id, token, dispatch]);

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const renderStepsComponent = () => {
    switch (type) {
      case "product":
        return <RenderStepsProduct />;
      case "rent":
        return <RenderStepsRentals />;
      case "service":
        return <RenderStepsService />;
      case "category":
        return <RenderStepsCategory />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit {type.charAt(0).toUpperCase() + type.slice(1)}
      </h1>
      <div className="mx-auto max-w-[600px]">
        {renderStepsComponent() ? (
          renderStepsComponent()
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            {type.charAt(0).toUpperCase() + type.slice(1)} not found
          </p>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { updateProduct,createProduct } from "../../../../../../../services/operations/productDetailsAPI";
import { fetchAllCategories } from "../../../../../../../services/operations/categoryDetailsAPI";
import { setProduct, setStep } from "../../../../../../../slices/productSlice";
import { STATUS } from "../../../../../../../utils/constants";
import IconBtn from "../../../../../../Common/IconBtn";
import Upload from "../upload";

export default function ProductBuilderForm() {
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { product, editProduct, step } = useSelector((state) => state.product);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const res = await fetchAllCategories();
        setCategoryData(res);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
      setLoading(false);
    };

    getCategories();
  }, []);

  useEffect(() => {
    if (editProduct && categoryData.length > 0) {
      setValue("name", product.name);
      setValue("description", product.description);
      setValue("price", product.price);
      setValue("category", product.category?._id);
      setValue("quantity", product.quantity);
      setValue("thumbnail", product.thumbnail);
    }
  }, [editProduct, product, categoryData, setValue]);

  const isFormUpdated = () => {
    const currentValues = getValues();
    return (
      currentValues.name !== product.name ||
      currentValues.description !== product.description ||
      currentValues.price !== product.price ||
      currentValues.category !== product.category._id ||
      currentValues.quantity !== product.quantity ||
      currentValues.thumbnail !== product.thumbnail
    );
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (editProduct) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        if (currentValues.name !== product.name) formData.append("name", data.name);
        if (currentValues.description !== product.description) formData.append("description", data.description);
        if (currentValues.price !== product.price) formData.append("price", data.price);
        if (currentValues.category !== product.category._id) formData.append("category", data.category);
        if (currentValues.quantity !== product.quantity) formData.append("quantity", data.quantity);
        if (currentValues.thumbnail !== product.thumbnail) formData.append("thumbnailImage", data.thumbnail);

        setLoading(true);
        const result = await updateProduct(formData, product._id, token);
        setLoading(false);

        if (result) {
          dispatch(setStep(2));
          dispatch(setProduct(result));
        }
      } else {
        toast.error("No changes made to the form");
      }
      return;
    }

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("quantity", data.quantity);
    formData.append("thumbnailImage", data.thumbnail);
    formData.append("status", STATUS.DRAFT);

    setLoading(true);
    const result = await createProduct(formData, token);
    setLoading(false);

    console.log("result :",result);
    if (result) {
      dispatch(setStep(2));
      dispatch(setProduct(result));
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Product Name */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="name">
        Product Name <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="name"
          placeholder="Enter Product Name"
          {...register("name", { required: true })}
          className="form-style w-full"
        />
        {errors.name && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
          Product name is required
          </span>
        )}
      </div>
  
      {/*  Product Description  */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="description">
        Product Description  <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="description"
          placeholder="Enter Description"
          {...register("description", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.description && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Product Description is required
          </span>
        )}
      </div>
      {/* Product Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="price">
        Product Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="price"
            placeholder="Enter Product Price"
            {...register("price", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.price && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Product Price is required
          </span>
        )}
      </div>
      {/* Product Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="category">
        Product Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("category", { required: true })}
          defaultValue=""
          id="category"
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            categoryData?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.category && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Product Category is required
          </span>
        )}
      </div>
  
      {/* Product Quantity */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="quantity">
          Product Quantity <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="quantity"
          type="number"
          placeholder="Enter Product Quantity"
          {...register("quantity", { required: true, valueAsNumber: true })}
          className="form-style w-full"
        />
        {errors.quantity && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Product quantity is required
          </span>
        )}
      </div>
      
      {/* Product Thumbnail Image */}
      <Upload
        name="thumbnail"
        label="Product Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editProduct ? product?.thumbnail  : null}
      />
      
      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editProduct && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editProduct ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )

}
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { addCategory, updateCategory } from "../../../../../../services/operations/categoryDetailsAPI";
import { setCategory, setStep } from "../../../../../../slices/categorySlice";
import { STATUS } from "../../../../../../utils/constants"
import IconBtn from "../../../../../Common/IconBtn"

export default function CategoryInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { category, editCategory } = useSelector((state) => state.category);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editCategory) {
      setValue("categoryName", category.name);
      setValue("categoryDescription", category.description);
    }
  }, [editCategory, setValue, category]);

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.categoryName !== category.name ||
      currentValues.categoryDescription !== category.description
    ) {
      return true;
    }
    return false;
  };

  const onSubmit = async (data) => {
    if (editCategory) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();
        if (currentValues.categoryName !== category.name) {
          formData.append("name", data.categoryName);
        }
        if (currentValues.categoryDescription !== category.description) {
          formData.append("description", data.categoryDescription);
        }

        formData.append("status", "Draft");

        setLoading(true);
        const result = await updateCategory(formData, category._id, token);
        setLoading(false);
        if (result) {
          dispatch(setStep(2));
          dispatch(setCategory(result));
        }
      } else {
        toast.error("No changes made to the form");
      }
      return;
    }

    const formData = new FormData();
    formData.append("name", data.categoryName);
    formData.append("description", data.categoryDescription);
    formData.append("status", STATUS.DRAFT);

    setLoading(true);
    const result = await addCategory(formData, token);
    if (result) {
      dispatch(setStep(2));
      dispatch(setCategory(result));
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Category Name */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="categoryName">
          Category Name <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="categoryName"
          placeholder="Enter Category Name"
          {...register("categoryName", { required: true })}
          className="form-style w-full"
        />
        {errors.categoryName && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Category name is required
          </span>
        )}
      </div>
      {/* Category Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="categoryDescription">
          Category Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="categoryDescription"
          placeholder="Enter Category Description"
          {...register("categoryDescription", { required: true })}
          className="form-style resize-none min-h-[130px] w-full"
        />
        {errors.categoryDescription && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Category description is required
          </span>
        )}
      </div>
      {/* Hidden Status Field */}
      <input type="hidden" {...register("status")} value="Draft" />
      {/* Submit Button */}
      <div className="flex justify-end gap-x-2">
        {editCategory && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Continue Without Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editCategory ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}

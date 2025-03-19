import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import {
  addRentItemDetails,
  editRentItemDetails,
} from "../../../../../../../services/operations/rentDetailsAPI";

import {
  fetchAllCategories
} from "../../../../../../../services/operations/categoryDetailsAPI";

import { setRent, setStep } from "../../../../../../../slices/rentSlice";
import { STATUS } from "../../../../../../../utils/constants";
import IconBtn from "../../../../../../Common/IconBtn";
import Upload from "../Upload";
//import ChipInput from "./ChipInput";
import RequirementsField from "./RequirementsField"

export default function RentItemInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { rent,   editRent  } = useSelector((state) => state.rent);
  const [loading, setLoading] = useState(false);
  const [rentItemCategories, setRentItemCategories] = useState([]);

  console.log(rent,editRent)

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchAllCategories();
      if (categories.length > 0) {
        setRentItemCategories(categories);
      }
      setLoading(false);
    }

    if (editRent) {
      setValue("name", rent.name);
      setValue("description", rent.description);
      setValue("price", rent.price);
     // setValue("tags", service.tag);
      setValue("location", rent.location);
      setValue("category", rent.category);
      setValue("thumbnailImage", rent.thumbnail);
      setValue("rentBenefits",rent.whatYouWillLearn)
      setValue("rentRequirements", rent.instructions);
    }

    getCategories();
  }, []); //editService, service, setValue

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.name !== rent.serviceName ||
      currentValues.description !== rent.serviceDescription ||
      currentValues.price !== rent.price ||
     // currentValues.tags.toString() !== service.tag.toString() ||
      currentValues.location !== rent.location ||
      currentValues.category !== rent.category._id ||
      currentValues.thumbnailImage !== rent.thumbnail ||
      currentValues.rentBenefits !== rent.whatYouWillLearn ||
      currentValues.rentRequirements.toString() !==
      rent.instructions.toString() 
    ) {
      return true;
    }
    return false;
  };

  const onSubmit = async (data) => {

    console.log("Current Token:", token);
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("price", data.price);
 //   formData.append("tags", JSON.stringify(data.tags));
    formData.append("category", data.category);
    formData.append("status", STATUS.DRAFT);
    formData.append("thumbnailImage", data.thumbnailImage);
    formData.append(
      "instructions",
      JSON.stringify(data.rentRequirements)
    )
    formData.append("whatYouWillLearn", data.rentBenefits)

    setLoading(true);

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    if (editRent) {
      if (isFormUpdated()) {
        formData.append("rentItemId", rent._id);
        
        const result = await editRentItemDetails({rentItemId : rent._id,formData}, token);
        console.log(result);
        if (result) {
          toast.success("Rent Item Details dispatching");
          dispatch(setRent(result));
          dispatch(setStep(2));
      
        }
      } else {
        toast.error("No changes made to the form");
      }
    } else {
      const result = await addRentItemDetails(formData, token);
      console.log(result);
      if (result) {
        dispatch(setRent(result));
        console.log("------------------------------------>",rent)
        dispatch(setStep(2));
     
       
      }
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="name">
          Rent Item Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="name"
          placeholder="Enter  Rent Item Title"
          {...register("name", { required: true })}
          className="form-style w-full"
        />
        {errors.name && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
          Rent Item title is required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="description">
        Rent Item Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="description"
          placeholder="Enter Description"
          {...register("description", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.description && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
          Rent Item Description is required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="price">
        Rent Item Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="price"
            placeholder="Enter  Rent Item Price"
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
          Rent Item Price is required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="location">
        Rent Item Location <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="location"
          placeholder="Enter  Rent Item Location"
          {...register("location", { required: true })}
          className="form-style w-full"
        />
        {errors.location && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
          Rent Item Location is required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="category">
        Rent Item Category <sup className="text-pink-200">*</sup>
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
            rentItemCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.category && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Rent Item Category is required
          </span>
        )}
      </div>

      {/* <ChipInput
        label="Tags"
        name="tags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      /> */}

      <Upload
        name="thumbnailImage"
        label="Rent Item Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editRent ? rent?.thumbnail : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="rentBenefits">
          Benefits of the Rent Item <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="rentBenefits"
          placeholder="Enter benefits of the Rent Item"
          {...register("rentBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.rentBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the Rent Item is required
          </span>
        )}
      </div>
      {/* Requirements/Instructions */}
      <RequirementsField
        name="rentRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      <div className="flex justify-end gap-x-2">
        {editRent && (
          <button
            type="button"
            onClick={() => dispatch(setStep(2))}
            className="rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Continue Without Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editRent ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}

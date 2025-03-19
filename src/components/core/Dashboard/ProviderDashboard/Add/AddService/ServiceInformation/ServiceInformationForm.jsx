import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import {
  addServiceDetails,
  editServiceDetails,
} from "../../../../../../../services/operations/serviceDetailsAPI";

import {
  fetchAllCategories
} from "../../../../../../../services/operations/categoryDetailsAPI";

import { setService, setStep } from "../../../../../../../slices/serviceSlice";
import { STATUS } from "../../../../../../../utils/constants";
import IconBtn from "../../../../../../Common/IconBtn";
import Upload from "../Upload";
//import ChipInput from "./ChipInput";
import RequirementsField from "./RequirementsField"

export default function ServiceInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { service, editService } = useSelector((state) => state.service);
  const [loading, setLoading] = useState(false);
  const [serviceCategories, setServiceCategories] = useState([]);

  console.log(service,editService)

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchAllCategories();
      if (categories.length > 0) {
        setServiceCategories(categories);
      }
      setLoading(false);
    }

    if (editService) {
      setValue("name", service.name);
      setValue("description", service.description);
      setValue("price", service.price);
     // setValue("tags", service.tag);
      setValue("location", service.location);
      setValue("category", service.category);
      setValue("thumbnailImage", service.thumbnail);
      setValue("serviceBenefits",service.whatYouWillLearn)
      setValue("serviceRequirements", service.instructions);
    }

    getCategories();
  }, []); //editService, service, setValue

  const isFormUpdated = () => {
    const currentValues = getValues();
    if (
      currentValues.name !== service.serviceName ||
      currentValues.description !== service.serviceDescription ||
      currentValues.price !== service.price ||
     // currentValues.tags.toString() !== service.tag.toString() ||
      currentValues.location !== service.location ||
      currentValues.category !== service.category._id ||
      currentValues.thumbnailImage !== service.thumbnail ||
      currentValues.serviceBenefits !== service.whatYouWillLearn ||
      currentValues.serviceRequirements.toString() !==
      service.instructions.toString() 
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
      JSON.stringify(data.serviceRequirements)
    )
    formData.append("whatYouWillLearn", data.serviceBenefits)

    setLoading(true);

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    if (editService) {
      if (isFormUpdated()) {
        formData.append("serviceId", service._id);
        
        const result = await editServiceDetails({serviceId : service._id,formData}, token);
        console.log(result);
        if (result) {
          toast.success("Service Details dispatching");
          dispatch(setService(result));
          dispatch(setStep(2));
      
        }
      } else {
        toast.error("No changes made to the form");
      }
    } else {
      const result = await addServiceDetails(formData, token);
      console.log(result);
      if (result) {
        dispatch(setService(result));
        console.log("------------------------------------>",service)
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
          Service Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="name"
          placeholder="Enter Service Title"
          {...register("name", { required: true })}
          className="form-style w-full"
        />
        {errors.name && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Service title is required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="description">
          Service Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="description"
          placeholder="Enter Description"
          {...register("description", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.description && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Service Description is required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="price">
          Service Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="price"
            placeholder="Enter Service Price"
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
            Service Price is required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="location">
          Service Location <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="location"
          placeholder="Enter Service Location"
          {...register("location", { required: true })}
          className="form-style w-full"
        />
        {errors.location && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Service Location is required
          </span>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="category">
          Service Category <sup className="text-pink-200">*</sup>
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
            serviceCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.category && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Service Category is required
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
        label="Service Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editService ? service?.thumbnail : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="serviceBenefits">
          Benefits of the Service <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="serviceBenefits"
          placeholder="Enter benefits of the service"
          {...register("serviceBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.serviceBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the service is required
          </span>
        )}
      </div>
      {/* Requirements/Instructions */}
      <RequirementsField
        name="serviceRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />

      <div className="flex justify-end gap-x-2">
        {editService && (
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
          text={!editService ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}

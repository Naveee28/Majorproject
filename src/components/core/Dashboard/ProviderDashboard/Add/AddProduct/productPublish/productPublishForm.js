import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProduct } from "../../../../../../../services/operations/productDetailsAPI";
import { resetProductState, setStep ,setEditProduct } from "../../../../../../../slices/productSlice";
import { STATUS } from "../../../../../../../utils/constants"
import IconBtn from "../../../../../../Common/IconBtn"

export default function ProductPublishForm() {
  const { register, handleSubmit, setValue, getValues } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { product } = useSelector((state) => state.product)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product?.status === STATUS.PUBLISHED) {
      setValue("public", true)
    }
  }, [product?.status, setValue])

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditProduct(true))
  }

  const goToMyProducts = () => {
    dispatch(resetProductState())
    navigate("/dashboard/my-products")
  }

  const handleProductPublish = async () => {
    if (
      (product?.status === STATUS.PUBLISHED && getValues("public") === true) ||
      (product?.status === STATUS.DRAFT && getValues("public") === false)
    ) {
      goToMyProducts()
      return

    }
    const formData = new FormData()
    const productStatus = getValues("public")
      ? STATUS.PUBLISHED
      : STATUS.DRAFT
    formData.append("status", productStatus)
    setLoading(true)
    const result = await updateProduct(formData,product._id, token)
    if (result) {
      goToMyProducts()
    }
    setLoading(false)
  }

  const onSubmit = (data) => 
    {
    handleProductPublish().then(() => {
      navigate("/dashboard/my-products")
    });
  }

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox */}
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this Product public
            </span>
          </label>
        </div>

        {/* Next Prev Button */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>
          <IconBtn disabled={loading} text="Save Changes" />
        </div>
      </form>
    </div>
  )
}

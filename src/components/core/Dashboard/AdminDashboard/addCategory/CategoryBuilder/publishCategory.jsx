import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateCategory } from "../../../../../../services/operations/categoryDetailsAPI";
import { resetCategoryState, setStep ,setEditCategory } from "../../../../../../slices/categorySlice";
import { STATUS } from "../../../../../../utils/constants"
import IconBtn from "../../../../../Common/IconBtn"

export default function PublishCategory() {
  const { register, handleSubmit, setValue, getValues } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { category } = useSelector((state) => state.category)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category?.status === STATUS.PUBLISHED) {
      setValue("public", true)
    }
  }, [category?.status, setValue])

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCategory(true))
  }

  const goToCategories = () => {
    dispatch(resetCategoryState())
    navigate("/dashboard/my-categories")
  }

  const handleCategoryPublish = async () => {
    if (
      (category?.status === STATUS.PUBLISHED && getValues("public") === true) ||
      (category?.status === STATUS.DRAFT && getValues("public") === false)
    ) {
      goToCategories()
      return
    }
    const formData = new FormData()
    formData.append("categoryId", category._id)
    const categoryStatus = getValues("public")
      ? STATUS.PUBLISHED
      : STATUS.DRAFT
    formData.append("status", categoryStatus)
    setLoading(true)
    const result = await updateCategory(formData,category._id, token)
    if (result) {
      goToCategories()
    }
    setLoading(false)
  }

  const onSubmit = (data) => {
    handleCategoryPublish()
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
              Make this category public
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

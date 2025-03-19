import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { IoAddCircleOutline } from 'react-icons/io5'
import { MdNavigateNext } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'

import { addServiceSlots } from '../../../../../../../services/operations/serviceDetailsAPI'
import { setService, setEditService, setStep } from '../../../../../../../slices/serviceSlice'

import IconBtn from '../../../../../../Common/IconBtn'
import NestedView from './NestedVIew'
import ConfirmationModal from '../../../../../../Common/ConfirmationModal'

export default function ServiceBuilderForm() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const { service } = useSelector((state) => state.service)
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    console.log("Current Token:", token);
    console.log("Data before sending:", { ...data, serviceId: service._id }); 

    setLoading(true)


    const result = await addServiceSlots({ ...data, serviceId: service._id }, token)
    if (result) {
      dispatch(setService(result))
      console.log(result)
      setValue('startDate', '')
      setValue('endDate', '')
      setValue('startTime', '')
      setValue('endTime', '')
    }
    setLoading(false)
  }

  const handleCreateSlot = (data) => {
    setConfirmationModal({
      text1: 'Create this Slot?',
      text2: 'Once created, the slot cannot be deleted.',
      btn1Text: 'Create',
      btn2Text: 'Cancel',
      btn1Handler: () => {
        onSubmit(data)
        setConfirmationModal(null)
      },
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const goToNext = () => {
    if (!service.slots || service.slots.length === 0) {
      toast.error('Please add at least one slot')
      return
    }
    dispatch(setStep(3))
  }

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditService(true))
  }

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Service Slot Builder</p>
      <form onSubmit={handleSubmit(handleCreateSlot)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="startDate">
            Start Date <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="startDate"
            type="date"
            disabled={loading}
            {...register('startDate', { required: true })}
            className="form-style w-full"
          />
          {errors.startDate && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Start date is required
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="endDate">
            End Date <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="endDate"
            type="date"
            disabled={loading}
            {...register('endDate', { required: true })}
            className="form-style w-full"
          />
          {errors.endDate && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              End date is required
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="startTime">
            Start Time <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="startTime"
            type="time"
            disabled={loading}
            {...register('startTime', { required: true })}
            className="form-style w-full"
          />
          {errors.startTime && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Start time is required
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="endTime">
            End Time <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="endTime"
            type="time"
            disabled={loading}
            {...register('endTime', { required: true })}
            className="form-style w-full"
          />
          {errors.endTime && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              End time is required
            </span>
          )}
        </div>
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text="Create Slot"
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
        </div>
      </form>
      {service.slots && service.slots.length > 0 && (
        <NestedView serviceSlots={service.slots} />
      )}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
        >
          Back
        </button>
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </div>
  )
}

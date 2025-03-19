import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step: 1,
  service: null,
  editService: false,
  paymentLoading: false,
  enableWriteReview : false
}

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload
    },
    setService: (state, action) => {
      state.service = action.payload
    },
    setEditService: (state, action) => {
      state.editService = action.payload
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload
    },
    setWriteReview : (state ,action) => {
      state.enableWriteReview = action.payload
    },
    resetServiceState: (state) => {
      state.step = 1
      state.service = null
      state.editService = false
    },
  },
})

export const {
  setStep,
  setService,
  setEditService,
  setPaymentLoading,
  setWriteReview,
  resetServiceState,
} = serviceSlice.actions

export default serviceSlice.reducer

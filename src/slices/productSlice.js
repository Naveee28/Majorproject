import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step: 1,
  product: null,
  editProduct: false,
  paymentLoading: false,
}

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setStep: (state, action) => {
       state.step = action.payload
    },
    setProduct: (state, action) => {
      state.product = action.payload
    },
    setEditProduct: (state, action) => {
      state.editProduct = action.payload
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload
    },
    resetProductState: (state) => {
      state.step = 1
      state.product = null
      state.editProduct = false
    },
  },
})

export const {
  setStep,
  setProduct,
  setEditProduct,
  setPaymentLoading,
  resetProductState,
} = productSlice.actions

export default productSlice.reducer

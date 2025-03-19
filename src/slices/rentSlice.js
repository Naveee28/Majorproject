import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  rent: null,
  editRent: false,
  paymentLoading: false,
  enableWriteReview : false
};

const rentSlice = createSlice({
  name: "rent",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    setRent: (state, action) => {
      state.rent = action.payload;
    },
    setEditRent: (state, action) => {
      state.editRent = action.payload;
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload;
    },
    setWriteReview : (state ,action) => {
      state.enableWriteReview = action.payload
    },
    resetRentState: (state) => {
      state.step = 1;
      state.rent = null;
      state.editRent = false;
    },
  },
});

export const {
  setStep,
  setRent,
  setEditRent,
  setPaymentLoading,
  setWriteReview,
  resetRentState,
} = rentSlice.actions;

export default rentSlice.reducer;

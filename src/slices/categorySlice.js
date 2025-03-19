import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step: 1,
  category: null,
  editCategory: false,
}

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload
    },
    setCategory: (state, action) => {
      state.category = action.payload
    },
    setEditCategory: (state, action) => {
      state.editCategory = action.payload
    },
    resetCategoryState: (state) => {
      state.step = 1
      state.category = null
      state.editCategory = false
    },
  },
})

export const {
  setStep,
  setCategory,
  setEditCategory,
  resetCategoryState,
} = categorySlice.actions

export default categorySlice.reducer
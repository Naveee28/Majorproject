import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  slots: [],
  loading: false,
  error: null,
  selectedDate: new Date(),
  bookedSlot: null,
};



const slotSlice = createSlice({
  name: "slots",
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    resetSlotState: (state) => {
      state.slots = [];
      state.loading = false;
      state.error = null;
      state.selectedDate = new Date();
      state.bookedSlot = null;
    },
  },
});

export const { setSelectedDate, resetSlotState } = slotSlice.actions;

export default slotSlice.reducer;

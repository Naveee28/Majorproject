import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  wishlist: null,
  loading: false,
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: initialState,
  reducers: {


    setWishlist: (state, action) => {
      state.wishlist = action.payload
    },
   
    setLoading(state, value) {
      state.loading = value.payload
    },
  },
})

export const { setWishlist, setLoading } = wishlistSlice.actions

export default wishlistSlice.reducer

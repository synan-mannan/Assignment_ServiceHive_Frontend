import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bids: [],
  loading: false,
  error: null,
};

const bidsSlice = createSlice({
  name: "bids",
  initialState,
  reducers: {
    fetchBidsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBidsSuccess: (state, action) => {
      state.loading = false;
      state.bids = action.payload;
    },
    fetchBidsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    submitBidStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    submitBidSuccess: (state, action) => {
      state.loading = false;
      state.bids.push(action.payload);
    },
    submitBidFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    hireBidStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    hireBidSuccess: (state, action) => {
      state.loading = false;
      state.bids = state.bids.map((bid) =>
        bid._id === action.payload._id ? action.payload : bid
      );
    },
    hireBidFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchBidsStart,
  fetchBidsSuccess,
  fetchBidsFailure,
  submitBidStart,
  submitBidSuccess,
  submitBidFailure,
  hireBidStart,
  hireBidSuccess,
  hireBidFailure,
  clearError,
} = bidsSlice.actions;

export default bidsSlice.reducer;

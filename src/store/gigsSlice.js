import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gigs: [],
  currentGig: null,
  loading: false,
  error: null,
};

const gigsSlice = createSlice({
  name: "gigs",
  initialState,
  reducers: {
    fetchGigsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchGigsSuccess: (state, action) => {
      state.loading = false;
      state.gigs = action.payload;
    },
    fetchGigsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchGigStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchGigSuccess: (state, action) => {
      state.loading = false;
      state.currentGig = action.payload;
    },
    fetchGigFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createGigStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createGigSuccess: (state, action) => {
      state.loading = false;
      state.gigs.unshift(action.payload);
    },
    createGigFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchGigsStart,
  fetchGigsSuccess,
  fetchGigsFailure,
  fetchGigStart,
  fetchGigSuccess,
  fetchGigFailure,
  createGigStart,
  createGigSuccess,
  createGigFailure,
  clearError,
} = gigsSlice.actions;

export default gigsSlice.reducer;

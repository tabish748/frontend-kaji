import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  isLoading: boolean;
  activeRequests: number;
}

const initialState: LoadingState = {
  isLoading: false,
  activeRequests: 0,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.activeRequests += 1;
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.activeRequests = Math.max(0, state.activeRequests - 1);
      state.isLoading = state.activeRequests > 0;
    },
    resetLoading: (state) => {
      state.activeRequests = 0;
      state.isLoading = false;
    }
  },
});

export const { startLoading, stopLoading, resetLoading } = loadingSlice.actions;
export default loadingSlice.reducer; 
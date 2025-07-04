import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface ReactivateRequestPayload {
  customer_contract_id: number;
  contract_status: number;
}

interface ReactivateRequestState {
  loading: boolean;
  success: boolean | null;
  error: string | null;
  message: string | null;
}

const initialState: ReactivateRequestState = {
  loading: false,
  success: null,
  error: null,
  message: null,
};

export const reactivateRequest = createAsyncThunk(
  'reactivateRequest/submit',
  async (payload: ReactivateRequestPayload) => {
    const endpoint = '/api/customer/change-contract-plan-status-request/save';
    return await ApiHandler.request(endpoint, 'POST', payload);
  }
);

const reactivateRequestSlice = createSlice({
  name: 'reactivateRequest',
  initialState,
  reducers: {
    resetReactivateRequest: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reactivateRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(reactivateRequest.fulfilled, (state, action: PayloadAction<{ message: string; success: boolean }>) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(reactivateRequest.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message || 'An error occurred while processing the reactivate request.';
      });
  },
});

export const { resetReactivateRequest } = reactivateRequestSlice.actions;
export default reactivateRequestSlice.reducer; 
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface ChangePlanRequestPayload {
  customer_contract_id: number;
  customer_contract_plan_id: number;
  service_id: number;
  contract_plan_id: number;
  time_range: number;
  extended_time: number;
  contract_period_start: string;
  contract_period_end: string;
  service_hours_start: string;
  service_hours_end: string;
  recurrence_type?: string;
  interval?: string;
  days_of_week: { [key: string]: string };
}

interface ChangePlanRequestState {
  loading: boolean;
  success: boolean | null;
  error: string | null;
  message: string | null;
}

const initialState: ChangePlanRequestState = {
  loading: false,
  success: null,
  error: null,
  message: null,
};

export const changePlanRequest = createAsyncThunk(
  'customer/changePlanRequest',
  async (payload: ChangePlanRequestPayload) => {
    const endpoint = '/api/customer/change-contract-plan-request/save';
    return await ApiHandler.request(endpoint, 'POST', payload);
  }
);

const changePlanRequestSlice = createSlice({
  name: 'changePlanRequest',
  initialState,
  reducers: {
    resetChangePlanRequest: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePlanRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      .addCase(changePlanRequest.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(changePlanRequest.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message || null;
        state.message = null;
      });
  },
});

export default changePlanRequestSlice.reducer;
export const { resetChangePlanRequest } = changePlanRequestSlice.actions; 
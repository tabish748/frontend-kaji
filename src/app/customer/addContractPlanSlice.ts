import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface AddContractPlanPayload {
  customer_contract_id: number;
  service_id: number;
  contract_plan_id: number;
  time_range: number;
  extended_time: number;
  contract_period_start: string;
  contract_period_end: string;
  service_hours_start: string;
  service_hours_end: string;
  recurrence_type: string;
  interval: string;
  days_of_week: {
    [key: string]: string;
  };
}

interface AddContractPlanState {
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean | null;
}

const initialState: AddContractPlanState = {
  loading: false,
  error: null,
  message: '',
  success: null,
};

export const addContractPlan = createAsyncThunk(
  'addContractPlan/addContractPlan',
  async (payload: AddContractPlanPayload) => {
    const endpoint = '/api/customer/add-contract-plan-request/save';
    return await ApiHandler.request(endpoint, 'POST', payload);
  }
);

const addContractPlanSlice = createSlice({
  name: 'addContractPlan',
  initialState,
  reducers: {
    resetAddContractPlan: (state) => {
      state.loading = false;
      state.error = null;
      state.message = '';
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addContractPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addContractPlan.fulfilled, (state, action: PayloadAction<{ data: any, message: string, success: boolean }>) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = true;
      })
      .addCase(addContractPlan.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message || 'Failed to add contract plan';
      });
  },
});

export default addContractPlanSlice.reducer;
export const { resetAddContractPlan } = addContractPlanSlice.actions; 
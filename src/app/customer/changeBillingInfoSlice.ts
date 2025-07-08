// changeBillingInfoSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface BillingChangePayload {
  customer_contract_plan_id: number;
  name: string;
  name_kana: string;
  phone1: string;
  phone2?: string;
  phone3?: string;
  email1: string;
  email2?: string;
  post_code: string;
  prefecture_id: number;
  address1: string;
  address2?: string;
  apartment_name?: string;
}

interface BillingChangeState {
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean | null;
}

const initialState: BillingChangeState = {
  loading: false,
  error: null,
  message: null,
  success: null,
};

export const changeBillingInfo = createAsyncThunk(
  'changeBillingInfo/changeBillingInfo',
  async (payload: BillingChangePayload) => {
    const endpoint = '/api/customer/change-billing-info-request/save';
    return await ApiHandler.request(endpoint, 'POST', payload);
  }
);

const changeBillingInfoSlice = createSlice({
  name: 'changeBillingInfo',
  initialState,
  reducers: {
    resetBillingChange: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeBillingInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(changeBillingInfo.fulfilled, (state, action: PayloadAction<{ data: any, message: string, success: boolean }>) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.error = null;
      })
      .addCase(changeBillingInfo.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message || 'An error occurred while changing billing information';
      });
  },
});

export default changeBillingInfoSlice.reducer;
export const { resetBillingChange } = changeBillingInfoSlice.actions; 
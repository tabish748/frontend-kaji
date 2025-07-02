import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface ChangePaymentMethodPayload {
  customer_contract_id: number;
  customer_contract_plan_id: number;
  payment_method: number;
}

interface ChangePaymentMethodState {
  loading: boolean;
  success: boolean | null;
  error: string | null;
  message: string | null;
}

const initialState: ChangePaymentMethodState = {
  loading: false,
  success: null,
  error: null,
  message: null,
};

export const changePaymentMethod = createAsyncThunk(
  'customer/changePaymentMethod',
  async (payload: ChangePaymentMethodPayload) => {
    const endpoint = '/api/customer/change-payment-method-request/save';
    return await ApiHandler.request(endpoint, 'POST', payload);
  }
);

const changePaymentMethodSlice = createSlice({
  name: 'changePaymentMethod',
  initialState,
  reducers: {
    resetChangePaymentMethod: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      .addCase(changePaymentMethod.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(changePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message || null;
        state.message = null;
      });
  },
});

export default changePaymentMethodSlice.reducer;
export const { resetChangePaymentMethod } = changePaymentMethodSlice.actions; 
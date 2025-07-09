import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../api-handler';

// Define types for the update payload
interface UpdateCustomerPayload {
  first_inquiry_date: string;
  first_inquiry_hour: string;
  first_inquiry_minute: string;
  customer_status: string;
  name: string;
  name_kana: string;
  represents_id: string;
  dob_year: string;
  dob_month: string;
  dob_day: string;
  age: string;
  gender: string;
  phone1_type: string;
  phone1: string;
  phone2_type?: string;
  phone2?: string;
  phone3_type?: string;
  phone3?: string;
  email1: string;
  email2?: string;
  primary_contact_phone: string;
  primary_contact_email: string;
  post_code: string;
  prefecture_id: string;
  address1: string;
  address2?: string;
  apartment_name?: string;
  language: string;
  newsletter_emails: string;
  services: Record<string, string>;
  station_details: Array<{
    id?: number;
    date_added: string;
    company: string;
    route_name: string;
    nearest_station: string;
  }>;
  key_information: Array<{
    date_added: string;
    date_returned: string;
    user_id: string;
    status: string;
    existing_receipt?: any[];
  }>;
  deputy_checkin: string;
  deputy_remarks: string;
  match_list_hk: Record<string, string>;
  match_list_bs: Record<string, string>;
  match_list_remarks: string;
  remarks: string;
}

interface UpdateCustomerState {
  loading: boolean;
  success: boolean;
  error: any;
  message: string;
}

const initialState: UpdateCustomerState = {
  loading: false,
  success: false,
  error: null,
  message: '',
};

// Async thunk for updating customer basic info
export const updateCustomerBasicInfo = createAsyncThunk(
  'customer/updateBasicInfo',
  async ({ customerId, customerData }: { customerId: string | number; customerData: UpdateCustomerPayload | FormData }, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(
        `/api/company/customer/update/${customerId}`,
        'POST',
        customerData
      );

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.errors || response.message || 'Failed to update customer data');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || error.message || 'Network error occurred');
    }
  }
);

const updateCustomerBasicInfoSlice = createSlice({
  name: 'updateCustomerBasicInfo',
  initialState,
  reducers: {
    resetUpdateCustomerBasicInfo: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = '';
    },
    clearUpdateError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateCustomerBasicInfo.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = '';
      })
      .addCase(updateCustomerBasicInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload.message || 'Customer updated successfully';
      })
      .addCase(updateCustomerBasicInfo.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.message = '';
      });
  },
});

export const { resetUpdateCustomerBasicInfo, clearUpdateError } = updateCustomerBasicInfoSlice.actions;
export default updateCustomerBasicInfoSlice.reducer; 
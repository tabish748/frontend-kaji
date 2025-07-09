// getCustomerBasicInfoSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../api-handler';

// Define types for the customer data
interface CustomerData {
  id: number;
  inquiry_public_id?: string;
  name: string;
  name_kana: string;
  email: string;
  represents_id: string;
  dob: string;
  age: number;
  gender: number;
  email1: string;
  email2?: string;
  phone1_type: number;
  phone1: string;
  phone2_type?: number;
  phone2?: string;
  phone3_type?: number;
  phone3?: string;
  primary_contact_phone: string;
  primary_contact_email: string;
  post_code: string;
  prefecture_id: number;
  address1: string;
  address2?: string;
  apartment_name?: string;
  newsletter_emails: number;
  language: number;
  discovered_chev?: string;
  is_customer: number;
  is_payer: number;
  profile_completion_steps: {
    child_info: boolean;
    billing_info: boolean;
    payment_info: boolean;
    customer_info: boolean;
    child_order_form: boolean;
    customer_order_form: boolean;
    redirect_to_child_page: boolean;
  };
  profile_completed: number;
  first_inquiry_date: string;
  first_inquiry_hour: string;
  first_inquiry_minute: string;
  customer_status: string;
  services: number[];
  key_information: Array<{
    status: string;
    receipt: any[];
    user_id: string;
    date_added: string;
    date_returned: string;
    existing_receipt: any[];
  }>;
  deputy_checkin: string;
  deputy_remarks: string;
  match_list_hk: number[];
  match_list_bs: number[];
  match_list_remarks: string;
  remarks: string;
  status: number;
  email_verified_at: string;
  created_by: number;
  updated_by: number;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
  customer_routes: Array<{
    id: number;
    customer_id: number;
    date_added: string;
    company: string;
    route_name: string;
    nearest_station: string;
    status: number;
    created_by: number;
    updated_by: number;
    deleted_at?: string;
    created_at: string;
    updated_at: string;
  }>;
}

interface GetCustomerState {
  loading: boolean;
  success: boolean;
  error: any;
  customerData: CustomerData | null;
}

const initialState: GetCustomerState = {
  loading: false,
  success: false,
  error: null,
  customerData: null,
};

// Async thunk for getting customer basic info
export const getCustomerBasicInfo = createAsyncThunk(
  'customer/getBasicInfo',
  async (customerId: string | number, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(
        `/api/company/customer/show/${customerId}`,
        'GET'
      );

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.errors || response.message || 'Failed to fetch customer data');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || error.message || 'Network error occurred');
    }
  }
);

const getCustomerBasicInfoSlice = createSlice({
  name: 'getCustomerBasicInfo',
  initialState,
  reducers: {
    resetGetCustomerBasicInfo: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.customerData = null;
    },
    clearCustomerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerBasicInfo.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getCustomerBasicInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.customerData = action.payload;
      })
      .addCase(getCustomerBasicInfo.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.customerData = null;
      });
  },
});

export const { resetGetCustomerBasicInfo, clearCustomerError } = getCustomerBasicInfoSlice.actions;
export default getCustomerBasicInfoSlice.reducer; 
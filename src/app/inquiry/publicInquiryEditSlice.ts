import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiHandler from '../api-handler';

// Types for public inquiry data (based on API response)
interface PublicInquiryOrder {
  id: number;
  inquiry_public_id: number;
  submission_date: string;
  submission_hour: string;
  submission_minute: string;
  order_form_sent: number;
  responder_id: number;
  order_status: string;
  created_by: number;
  updated_by: number;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

interface PublicInquiryDetail {
  id: number;
  inquiry_public_id: number;
  person_incharge_id: number;
  inquiry_date: string;
  inquiry_hour: string;
  inquiry_minute: string;
  inquiry_status: string;
  inquiry: string;
  answer: string;
  status: number;
  created_by: number;
  updated_by: number;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

interface PublicInquiryStation {
  id?: number | string;
  date_added: string;
  company: string;
  route_name: string;
  nearest_station: string;
}

interface PublicInquiryData {
  id: number;
  first_inquiry_date: string;
  first_inquiry_hour: string;
  first_inquiry_minute: string;
  responder_id: number;
  inquiry_media_id: number;
  referral_source: number;
  referral_name: string;
  lead_status: string;
  name: string;
  name_kana: string;
  represents_id: number;
  dob: string;
  age: number;
  gender: number;
  email1: string;
  email2: string;
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
  address2: string;
  apartment_name: string;
  language: number;
  newsletter_emails: number;
  services: number[];
  first_service_requested_date: string;
  other_service_requests: string;
  remarks: string;
  routes: PublicInquiryStation[];
  inquiry_details: PublicInquiryDetail[];
  orders: PublicInquiryOrder[];
}

interface PublicInquiryEditState {
  loading: boolean;
  success: boolean;
  error: any;
  inquiryData: PublicInquiryData | null;
  updateLoading: boolean;
  updateSuccess: boolean;
  updateError: any;
}

const initialState: PublicInquiryEditState = {
  loading: false,
  success: false,
  error: null,
  inquiryData: null,
  updateLoading: false,
  updateSuccess: false,
  updateError: null,
};

// Async thunk for fetching public inquiry by ID
export const fetchPublicInquiryById = createAsyncThunk(
  'publicInquiryEdit/fetchById',
  async (inquiryId: string | number, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(
        `/api/company/public-inquiry/show/${inquiryId}`,
        'GET'
      );
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.errors || response.message || 'Failed to fetch public inquiry data');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || error.message || 'Network error occurred');
    }
  }
);

// Async thunk for updating public inquiry by ID
export const updatePublicInquiryById = createAsyncThunk(
  'publicInquiryEdit/updateById',
  async ({ inquiryId, inquiryData }: { inquiryId: string | number; inquiryData: any }, { rejectWithValue }) => {
    try {
      const response = await ApiHandler.request(
        `/api/company/public-inquiry/update/${inquiryId}`,
        'PUT',
        inquiryData
      );
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.errors || response.message || 'Failed to update public inquiry');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.errors || error.message || 'Network error occurred');
    }
  }
);

const publicInquiryEditSlice = createSlice({
  name: 'publicInquiryEdit',
  initialState,
  reducers: {
    resetPublicInquiryEdit: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.inquiryData = null;
      state.updateLoading = false;
      state.updateSuccess = false;
      state.updateError = null;
    },
    clearPublicInquiryEditError: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicInquiryById.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(fetchPublicInquiryById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.inquiryData = action.payload;
      })
      .addCase(fetchPublicInquiryById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.inquiryData = null;
      })
      .addCase(updatePublicInquiryById.pending, (state) => {
        state.updateLoading = true;
        state.updateSuccess = false;
        state.updateError = null;
      })
      .addCase(updatePublicInquiryById.fulfilled, (state) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.updateError = null;
      })
      .addCase(updatePublicInquiryById.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = false;
        state.updateError = action.payload;
      });
  },
});

export const { resetPublicInquiryEdit, clearPublicInquiryEditError } = publicInquiryEditSlice.actions;
export default publicInquiryEditSlice.reducer; 
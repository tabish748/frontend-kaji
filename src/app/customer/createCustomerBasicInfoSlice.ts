import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface StationDetail {
    date_added: string;
    company: string;
    route_name: string;
    nearest_station: string;
}

interface KeyInformation {
    date_added: string;
    date_returned: string;
    user_id: string;
    status: string;
}

interface CreateCustomerBasicInfoData {
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
    phone2_type: string;
    phone2: string;
    phone3_type: string;
    phone3: string;
    email1: string;
    email2: string;
    primary_contact_phone: string;
    primary_contact_email: string;
    post_code: string;
    prefecture_id: string;
    address1: string;
    address2: string;
    apartment_name: string;
    language: string;
    newsletter_emails: string;
    services: { [key: string]: string };
    station_details: StationDetail[];
    key_information: KeyInformation[];
    deputy_checkin: string;
    deputy_remarks: string;
    match_list_hk: { [key: string]: string };
    match_list_bs: { [key: string]: string };
    match_list_remarks: string;
    remarks: string;
}

interface CreateCustomerBasicInfoResponse {
    customer_id?: string;
    message: string;
}

interface CreateCustomerBasicInfoState {
    data: CreateCustomerBasicInfoResponse | null;
    loading: boolean;
    error: string | any | null; // Changed to allow validation errors object
    success: boolean;
}

const initialState: CreateCustomerBasicInfoState = {
    data: null,
    loading: false,
    error: null,
    success: false,
};

export const createCustomerBasicInfo = createAsyncThunk(
    'createCustomerBasicInfo/create',
    async (formData: CreateCustomerBasicInfoData | FormData, { rejectWithValue }) => {
        try {
            const endpoint = `/api/company/customer/create`;
            return await ApiHandler.request(endpoint, 'POST', formData);
        } catch (error: any) {
            // Return the full error object including validation errors
            return rejectWithValue(error);
        }
    }
);

const createCustomerBasicInfoSlice = createSlice({
    name: 'createCustomerBasicInfo',
    initialState,
    reducers: {
        resetCreateCustomerBasicInfo: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCustomerBasicInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createCustomerBasicInfo.fulfilled, (state, action: PayloadAction<{ data: CreateCustomerBasicInfoResponse, message: string, success: boolean }>) => {
                state.data = action.payload.data;
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(createCustomerBasicInfo.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.data = null;
                // Store the full error object which may contain validation errors
                if (action.payload && typeof action.payload === 'object' && 'errors' in action.payload) {
                    state.error = (action.payload as any).errors; // Store validation errors
                } else {
                    state.error = action.error.message || 'Failed to create customer';
                }
            });
    },
});

export default createCustomerBasicInfoSlice.reducer;
export const { resetCreateCustomerBasicInfo } = createCustomerBasicInfoSlice.actions; 
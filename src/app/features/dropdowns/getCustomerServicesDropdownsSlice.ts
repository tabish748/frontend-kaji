import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface DropdownOption {
    value: number | string;
    label: string;
    status?: boolean;
}

interface ApiCustomerServicesDropdownsResponse {
    users: DropdownOption[];
    customer_status: DropdownOption[];
    gender: DropdownOption[];
    health_statuses: DropdownOption[];
    hk_hc_cleaning_areas: DropdownOption[];
    hk_hc_inspection_areas: DropdownOption[];
    hk_hc_pets: DropdownOption[];
    hk_hc_services: DropdownOption[];
    home_statuses: DropdownOption[];
    language: DropdownOption[];
    personalities: DropdownOption[];
    services: DropdownOption[];
}

interface CustomerServicesDropdownsState {
    customerServicesDropdowns: ApiCustomerServicesDropdownsResponse | null;
    loading: boolean;
    error: string | null;
    message: string | null;
    success: boolean | null;
}

const initialState: CustomerServicesDropdownsState = {
    customerServicesDropdowns: null,
    loading: false,
    error: null,
    message: '',
    success: null,
};

export const fetchCustomerServicesDropdowns = createAsyncThunk(
    'customerServicesDropdowns/fetchCustomerServicesDropdowns',
    async () => {
        const endpoint = `/api/customer-services-options-admin`;
        return await ApiHandler.request(endpoint, 'GET');
    }
);

const getCustomerServicesDropdownsSlice = createSlice({
    name: 'customerServicesDropdowns',
    initialState,
    reducers: {
        resetCustomerServicesDropdowns: (state) => {
            state.customerServicesDropdowns = null;
            state.loading = false;
            state.error = null;
            state.message = '';
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomerServicesDropdowns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerServicesDropdowns.fulfilled, (state, action: PayloadAction<{ data: ApiCustomerServicesDropdownsResponse, message: string, success: boolean }>) => {
                state.customerServicesDropdowns = action.payload.data;
                state.loading = false;
                state.message = action.payload.message;
                state.success = true;
            })
            .addCase(fetchCustomerServicesDropdowns.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.customerServicesDropdowns = null;
                state.error = action.error.message || null;
            });
    },
});

export default getCustomerServicesDropdownsSlice.reducer;
export const { resetCustomerServicesDropdowns } = getCustomerServicesDropdownsSlice.actions; 
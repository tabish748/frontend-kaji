import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface DropdownOption {
    value: number | string;
    label: string;
}

interface ApiCustomerDropdownsResponse {
    represents: DropdownOption[];
    language: DropdownOption[];
    gender: DropdownOption[];
    phone_types: DropdownOption[];
    services: DropdownOption[];
    prefectures: DropdownOption[];
    newsletter: DropdownOption[];
    payment_method: DropdownOption[];
    billing_contact_info: DropdownOption[];
    personalities: DropdownOption[];
    health_statuses: DropdownOption[];
    customer_contract_types: DropdownOption[];
    contract_plans: DropdownOption[];
    matching_list_hk: DropdownOption[];
    matching_list_bs: DropdownOption[];
    customer_status: DropdownOption[];
}

interface CustomerDropdownsState {
    customerDropdowns: ApiCustomerDropdownsResponse | null;
    loading: boolean;
    error: string | null;
    message: string | null;
    success: boolean | null;
}

const initialState: CustomerDropdownsState = {
    customerDropdowns: null,
    loading: false,
    error: null,
    message: '',
    success: null,
};

export const fetchCustomerDropdowns = createAsyncThunk(
    'customerDropdowns/fetchCustomerDropdowns',
    async () => {
        const endpoint = `/api/customer-basic-info-options`;
        return await ApiHandler.request(endpoint, 'GET');
    }
);

const getCustomerDropdownsSlice = createSlice({
    name: 'customerDropdowns',
    initialState,
    reducers: {
        resetCustomerDropdowns: (state) => {
            state.customerDropdowns = null;
            state.loading = false;
            state.error = null;
            state.message = '';
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomerDropdowns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerDropdowns.fulfilled, (state, action: PayloadAction<{ data: ApiCustomerDropdownsResponse, message: string, success: boolean }>) => {
                state.customerDropdowns = action.payload.data;
                state.loading = false;
                state.message = action.payload.message;
                state.success = true;
            })
            .addCase(fetchCustomerDropdowns.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.customerDropdowns = null;
                state.error = action.error.message || null;
            });
    },
});

export default getCustomerDropdownsSlice.reducer;
export const { resetCustomerDropdowns } = getCustomerDropdownsSlice.actions; 
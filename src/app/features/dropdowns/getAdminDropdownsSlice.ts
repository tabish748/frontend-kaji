import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface DropdownOption {
    value: number | string;
    label: string;
}

interface ApiAdminDropdownsResponse {
    users: DropdownOption[] | null;
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
    customer_contract_types: DropdownOption[];
    contract_plans: DropdownOption[];
    matching_list_hk: DropdownOption[];
    matching_list_bs: DropdownOption[];
    customer_status: DropdownOption[];
}

interface AdminDropdownsState {
    adminDropdowns: ApiAdminDropdownsResponse | null;
    loading: boolean;
    error: string | null;
    message: string | null;
    success: boolean | null;
}

const initialState: AdminDropdownsState = {
    adminDropdowns: null,
    loading: false,
    error: null,
    message: '',
    success: null,
};

export const fetchAdminDropdowns = createAsyncThunk(
    'adminDropdowns/fetchAdminDropdowns',
    async () => {
        const endpoint = `/api/customer-basic-info-options-admin`;
        return await ApiHandler.request(endpoint, 'GET');
    }
);

const getAdminDropdownsSlice = createSlice({
    name: 'adminDropdowns',
    initialState,
    reducers: {
        resetAdminDropdowns: (state) => {
            state.adminDropdowns = null;
            state.loading = false;
            state.error = null;
            state.message = '';
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminDropdowns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminDropdowns.fulfilled, (state, action: PayloadAction<{ data: ApiAdminDropdownsResponse, message: string, success: boolean }>) => {
                state.adminDropdowns = action.payload.data;
                state.loading = false;
                state.message = action.payload.message;
                state.success = true;
            })
            .addCase(fetchAdminDropdowns.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.adminDropdowns = null;
                state.error = action.error.message || null;
            });
    },
});

export default getAdminDropdownsSlice.reducer;
export const { resetAdminDropdowns } = getAdminDropdownsSlice.actions; 
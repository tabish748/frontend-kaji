// getDropdownsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface DropdownOption {
    value: number | string;
    label: string;
}

interface ApiDropdownsResponse {
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
}

interface DropdownsState {
    dropdowns: ApiDropdownsResponse | null;
    loading: boolean;
    error: string | null;
    message: string | null;
    success: boolean | null;
}

const initialState: DropdownsState = {
    dropdowns: null,
    loading: false,
    error: null,
    message: '',
    success: null,
};

export const fetchDropdowns = createAsyncThunk(
    'dropdowns/fetchDropdowns',
    async () => {
        const endpoint = `/api/public-inquiry-form-dropdowns`;
        return await ApiHandler.request(endpoint, 'GET');
    }
);

const getDropdownsSlice = createSlice({
    name: 'dropdowns',
    initialState,
    reducers: {
        resetDropdowns: (state) => {
            state.dropdowns = null;
            state.loading = false;
            state.error = null;
            state.message = '';
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDropdowns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDropdowns.fulfilled, (state, action: PayloadAction<{ data: ApiDropdownsResponse, message: string, success: boolean }>) => {
                state.dropdowns = action.payload.data;
                state.loading = false;
                state.message = action.payload.message;
                state.success = true;
            })
            .addCase(fetchDropdowns.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.dropdowns = null;
                state.error = action.error.message || null;
            });
    },
});

export default getDropdownsSlice.reducer;
export const { resetDropdowns } = getDropdownsSlice.actions; 
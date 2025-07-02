// inquiryCreateSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface Inquiry {
    subject: string;
    message: string;
    customer_id: number | null;
    // Add any additional properties that are required for an inquiry
}

interface ApiError {
    message: string;
    response?: {
        message: string;
        errors: Record<string, string[]>
    };
}

interface InquiryCreateState {
    status: boolean;
    errorMessages: any;
    error: boolean;
    message: string | null;
    success: boolean;
    inquiryId: any;
    loading: boolean;
    data: any;
}

const initialState: InquiryCreateState = {
    status: false,
    errorMessages: null,
    error: false,
    message: null,
    inquiryId: null,
    success: false,
    loading: false,
    data: null,
};

export const createInquiry = createAsyncThunk(
    'inquiryCreate/createInquiry',
    async (inquiryData: Inquiry, { rejectWithValue }) => {
        const endpoint = '/api/inquiry-store';
        try {
            return await ApiHandler.request(endpoint, 'POST', inquiryData);
        } catch (error) {
            return rejectWithValue(error as any);
        }
    }
);

const inquiryCreateSlice = createSlice({
    name: 'inquiryCreate',
    initialState,
    reducers: {
        resetInquiryCreateState: (state) => {
            state.status = false;
            state.errorMessages = null;
            state.error = false;
            state.message = null;
            state.success = false;
            state.loading = false;
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createInquiry.pending, (state) => {
                state.status = false;
                state.errorMessages = null;
                state.error = false;
                state.loading = true;
                state.data = null;
            })
            .addCase(createInquiry.fulfilled, (state, action: PayloadAction<{ message: string, success: boolean, data: any }>) => {
                state.status = true;
                state.loading = false;
                state.error = false;
                state.message = action.payload.message;
                state.inquiryId = action.payload.data?.id;
                state.success = action.payload.success;
                state.data = action.payload.data;
            })
            .addCase(createInquiry.rejected, (state, action) => {
                state.status = false;
                state.loading = false;
                state.error = true;
                state.success = false;
                state.data = null;
                const errorPayload = action.payload as { errors?: Record<string, string[]> };
                const errorMessagesArray = Object.values(errorPayload.errors || {}).flat();
                state.errorMessages = errorMessagesArray.length ? errorMessagesArray : [action.error.message || 'Unknown error'];
            });
    },
});

export const { resetInquiryCreateState } = inquiryCreateSlice.actions;
export default inquiryCreateSlice.reducer;

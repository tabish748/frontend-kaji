import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface InquiryUpdatePayload {
    inquiry_id: number;
    // Add other fields that can be updated
    // ...
}
interface Inquiry {
    inquiry_id: number;
    // ... other fields
}

interface InquiryUpdateState {
    loading: boolean;
    error: string | null;
    message: string | null;
    success: boolean | null;
    errorMessages: any;
    updatedInquiry: Inquiry | null; // You can reuse the Inquiry interface from the previous slice if it's suitable
}

const initialState: InquiryUpdateState = {
    loading: false,
    error: null,
    message: '',
    success: false,
    updatedInquiry: null,
    errorMessages: null,
};

export const updateInquiry = createAsyncThunk(
    'inquiryUpdate/updateInquiry',
    async ({ inquiry_id, data }: { inquiry_id: number; data: InquiryUpdatePayload }, { rejectWithValue }) => {
        try {
            const endpoint = `/api/inquiry-update/${inquiry_id}`;
            return await ApiHandler.request(endpoint, 'PUT', data);
        } catch (error) {
            return rejectWithValue(error as any);
        }
    }
);


const inquiryUpdateSlice = createSlice({
    name: 'inquiryUpdate',
    initialState,
    reducers: {
        resetInquiryUpdateState: (state) => {
            state.loading = false;
            state.error = null;
            state.message = '';
            state.success = null;
            state.updatedInquiry = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateInquiry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateInquiry.fulfilled, (state, action: PayloadAction<{ data: Inquiry, message: string, success: boolean }>) => {
                state.updatedInquiry = action.payload.data;
                state.loading = false;
                state.message = action.payload.message;
                state.success = true;
            })
            .addCase(updateInquiry.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message || null;
                const errorPayload = action.payload as { errors?: Record<string, string[]> };
                const errorMessagesArray = Object.values(errorPayload.errors || {}).flat();
                state.errorMessages = errorMessagesArray.length ? errorMessagesArray : [action.error.message || 'Unknown error'];
            });
    },
});

export const { resetInquiryUpdateState } = inquiryUpdateSlice.actions;
export default inquiryUpdateSlice.reducer;

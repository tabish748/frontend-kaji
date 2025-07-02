// destroyInquirySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface DestroyInquiryState {
    loading: boolean;
    error: string | null;
    errorMessages: any;
    message: string | null;
    success: boolean;
}

const initialState: DestroyInquiryState = {
    loading: false,
    errorMessages: null,
    error: null,
    message: '',
    success: false,
};

export const destroyInquiryById = createAsyncThunk(
    'destroyInquiry/destroyInquiryById',
    async (id: number,  { rejectWithValue }) => {
        try {
            const endpoint = `/api/inquiry-destroy/${id}`;
            return await ApiHandler.request(endpoint, 'DELETE');    
        } catch (error) {
            return rejectWithValue(error as any);
        }
        
    }
);

const destroyInquirySlice = createSlice({
    name: 'destroyInquiry',
    initialState,
    reducers: {
        resetDestroyInquiryState: (state) => {
            state.loading = false;
            state.error = null;
            state.message = '';
            state.success = false;
            state.errorMessages = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(destroyInquiryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(destroyInquiryById.fulfilled, (state, action: PayloadAction<{ message: string, success: boolean }>) => {
                state.loading = false;
                state.message = action.payload.message;
                state.success = true;
            })
            .addCase(destroyInquiryById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message || null;
                const errorPayload = action.payload as { errors?: Record<string, string[]> };
                const errorMessagesArray = Object.values(errorPayload.errors || {}).flat();
                state.errorMessages = errorMessagesArray.length ? errorMessagesArray : [action.error.message || 'Unknown error'];
            });
    },
});

export default destroyInquirySlice.reducer;
export const { resetDestroyInquiryState } = destroyInquirySlice.actions;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface HmsShowServiceData {
    id?: number;
    customer_id?: number;
    person_incharge_id?: number;
    service_details?: { [key: string]: string };
    more_service_details?: { [key: string]: string };
    remarks?: string;
}

interface GetHmsShowServiceState {
    data: HmsShowServiceData | null;
    loading: boolean;
    error: string | any | null;
    success: boolean;
}

const initialState: GetHmsShowServiceState = {
    data: null,
    loading: false,
    error: null,
    success: false,
};

export const getHmsShowService = createAsyncThunk(
    'getHmsShowService/fetch',
    async (id: string, { rejectWithValue }) => {
        try {
            const endpoint = `/api/company/customer/service-hm/show/${id}`;
            return await ApiHandler.request(endpoint, 'GET');
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const getHmsShowServiceSlice = createSlice({
    name: 'getHmsShowService',
    initialState,
    reducers: {
        resetGetHmsShowService: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHmsShowService.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getHmsShowService.fulfilled, (state, action: PayloadAction<{ data: HmsShowServiceData, message: string, success: boolean }>) => {
                state.data = action.payload.data;
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(getHmsShowService.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.data = null;
                if (action.payload && typeof action.payload === 'object' && 'errors' in action.payload) {
                    state.error = (action.payload as any).errors;
                } else {
                    state.error = action.error.message || 'Failed to fetch HMS show service data';
                }
            });
    },
});

export default getHmsShowServiceSlice.reducer;
export const { resetGetHmsShowService } = getHmsShowServiceSlice.actions; 
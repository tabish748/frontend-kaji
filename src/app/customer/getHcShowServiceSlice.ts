import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface HcShowServiceData {
    id?: number;
    customer_id?: number;
    person_incharge_id?: number;
    service_details?: { [key: string]: string };
    more_service_details?: { [key: string]: string };
    other_service_details?: string;
    cleaning_locations?: { [key: string]: string };
    more_cleaning_locations?: { [key: string]: string };
    other_cleaning_locations?: string;
    inspection_locations?: { [key: string]: string };
    other_inspection_locations?: string;
    floor_plan?: string;
    existing_floor_plan_attachment?: string[];
    pets?: { [key: string]: string };
    pet_others?: string;
    home_status?: number;
    remarks?: string;
}

interface GetHcShowServiceState {
    data: HcShowServiceData | null;
    loading: boolean;
    error: string | any | null;
    success: boolean;
}

const initialState: GetHcShowServiceState = {
    data: null,
    loading: false,
    error: null,
    success: false,
};

export const getHcShowService = createAsyncThunk(
    'getHcShowService/fetch',
    async (id: string, { rejectWithValue }) => {
        try {
            const endpoint = `/api/company/customer/service-hc/show/${id}`;
            return await ApiHandler.request(endpoint, 'GET');
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const getHcShowServiceSlice = createSlice({
    name: 'getHcShowService',
    initialState,
    reducers: {
        resetGetHcShowService: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHcShowService.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getHcShowService.fulfilled, (state, action: PayloadAction<{ data: HcShowServiceData, message: string, success: boolean }>) => {
                state.data = action.payload.data;
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(getHcShowService.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.data = null;
                if (action.payload && typeof action.payload === 'object' && 'errors' in action.payload) {
                    state.error = (action.payload as any).errors;
                } else {
                    state.error = action.error.message || 'Failed to fetch HC show service data';
                }
            });
    },
});

export default getHcShowServiceSlice.reducer;
export const { resetGetHcShowService } = getHcShowServiceSlice.actions; 
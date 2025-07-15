import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface HkServiceData {
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
    floor_plan?: string;
    existing_floor_plan_attachment?: string[];
    pets?: { [key: string]: string };
    pet_others?: { [key: string]: string };
    home_status?: number;
    remarks?: string;
}

interface GetHkServiceResponse {
    data: HkServiceData;
    message: string;
}

interface GetHkServiceState {
    data: HkServiceData | null;
    loading: boolean;
    error: string | any | null;
    success: boolean;
}

const initialState: GetHkServiceState = {
    data: null,
    loading: false,
    error: null,
    success: false,
};

export const getHkService = createAsyncThunk(
    'getHkService/fetch',
    async (id: string, { rejectWithValue }) => {
        try {
            const endpoint = `/api/company/customer/service-hk/show/${id}`;
            return await ApiHandler.request(endpoint, 'GET');
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

export const deleteHkService = createAsyncThunk(
    'getHkService/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            const endpoint = `/api/company/customer/hk-service/delete/${id}`;
            return await ApiHandler.request(endpoint, 'DELETE');
        } catch (error: any) {
            return rejectWithValue(error);
        }
    }
);

const getHkServiceSlice = createSlice({
    name: 'getHkService',
    initialState,
    reducers: {
        resetGetHkService: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHkService.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getHkService.fulfilled, (state, action: PayloadAction<{ data: HkServiceData, message: string, success: boolean }>) => {
                state.data = action.payload.data;
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(getHkService.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.data = null;
                if (action.payload && typeof action.payload === 'object' && 'errors' in action.payload) {
                    state.error = (action.payload as any).errors;
                } else {
                    state.error = action.error.message || 'Failed to fetch HK service data';
                }
            })
            .addCase(deleteHkService.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteHkService.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = null;
                state.error = null;
            })
            .addCase(deleteHkService.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message || 'Failed to delete HK service';
            });
    },
});

export default getHkServiceSlice.reducer;
export const { resetGetHkService } = getHkServiceSlice.actions; 
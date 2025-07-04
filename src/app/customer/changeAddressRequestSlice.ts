import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface ChangeAddressPayload {
  post_code: string;
  prefecture_id: number;
  address1: string;
  address2: string;
  apartment_name: string;
  stations: {
    company: string;
    route_name: string;
    nearest_station: string;
  }[];
}

interface ChangeAddressState {
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean | null;
}

const initialState: ChangeAddressState = {
  loading: false,
  error: null,
  message: '',
  success: null,
};

export const changeAddressRequest = createAsyncThunk(
  'changeAddress/changeAddressRequest',
  async (payload: ChangeAddressPayload) => {
    const endpoint = `/api/customer/change-address-request/save`;
    
    // Transform the payload to match the expected format
    const formattedPayload = {
      post_code: payload.post_code,
      prefecture_id: payload.prefecture_id,
      address1: payload.address1,
      address2: payload.address2,
      apartment_name: payload.apartment_name,
      'stations[0][company]': payload.stations[0]?.company || '',
      'stations[0][route_name]': payload.stations[0]?.route_name || '',
      'stations[0][nearest_station]': payload.stations[0]?.nearest_station || '',
      'stations[1][company]': payload.stations[1]?.company || '',
      'stations[1][route_name]': payload.stations[1]?.route_name || '',
      'stations[1][nearest_station]': payload.stations[1]?.nearest_station || '',
    };
    
    return await ApiHandler.request(endpoint, 'POST', formattedPayload);
  }
);

const changeAddressRequestSlice = createSlice({
  name: 'changeAddress',
  initialState,
  reducers: {
    resetChangeAddressRequest: (state) => {
      state.loading = false;
      state.error = null;
      state.message = '';
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeAddressRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(changeAddressRequest.fulfilled, (state, action: PayloadAction<{ message: string; success: boolean }>) => {
        state.loading = false;
        state.message = action.payload.message;
        state.success = action.payload.success;
        state.error = null;
      })
      .addCase(changeAddressRequest.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.error.message || 'An error occurred while updating address';
        state.message = '';
      });
  },
});

export default changeAddressRequestSlice.reducer;
export const { resetChangeAddressRequest } = changeAddressRequestSlice.actions; 
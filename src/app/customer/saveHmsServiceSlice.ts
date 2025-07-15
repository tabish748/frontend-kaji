import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface SaveHmsServiceState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SaveHmsServiceState = {
  loading: false,
  error: null,
  success: false,
};

export const saveHmsService = createAsyncThunk(
  'saveHmsService/save',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const endpoint = '/api/company/customer/hm-service/save';
      return await ApiHandler.request(endpoint, 'POST', formData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save HMS service');
    }
  }
);

const saveHmsServiceSlice = createSlice({
  name: 'saveHmsService',
  initialState,
  reducers: {
    resetSaveHmsService: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveHmsService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveHmsService.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(saveHmsService.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string || 'Failed to save HMS service';
      });
  },
});

export default saveHmsServiceSlice.reducer;
export const { resetSaveHmsService } = saveHmsServiceSlice.actions; 
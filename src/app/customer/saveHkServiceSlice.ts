import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface SaveHkServiceState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SaveHkServiceState = {
  loading: false,
  error: null,
  success: false,
};

export const saveHkService = createAsyncThunk(
  'saveHkService/save',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const endpoint = '/api/company/customer/hk-service/save';
      return await ApiHandler.request(endpoint, 'POST', formData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save HK service');
    }
  }
);

const saveHkServiceSlice = createSlice({
  name: 'saveHkService',
  initialState,
  reducers: {
    resetSaveHkService: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveHkService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveHkService.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(saveHkService.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string || 'Failed to save HK service';
      });
  },
});

export default saveHkServiceSlice.reducer;
export const { resetSaveHkService } = saveHkServiceSlice.actions; 
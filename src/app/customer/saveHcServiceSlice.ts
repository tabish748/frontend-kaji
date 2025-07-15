import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface SaveHcServiceState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SaveHcServiceState = {
  loading: false,
  error: null,
  success: false,
};

export const saveHcService = createAsyncThunk(
  'saveHcService/save',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const endpoint = '/api/company/customer/hc-service/save';
      return await ApiHandler.request(endpoint, 'POST', formData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save HC service');
    }
  }
);

const saveHcServiceSlice = createSlice({
  name: 'saveHcService',
  initialState,
  reducers: {
    resetSaveHcService: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveHcService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveHcService.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(saveHcService.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string || 'Failed to save HC service';
      });
  },
});

export default saveHcServiceSlice.reducer;
export const { resetSaveHcService } = saveHcServiceSlice.actions; 
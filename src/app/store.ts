import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import loadingReducer from './features/loading/loadingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

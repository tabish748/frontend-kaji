import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import loadingReducer from './features/loading/loadingSlice';
import customerBasicInfoReducer from './customer/getCustomerBasicInfoSlice';
import dropdownsReducer from './features/dropdowns/getDropdownsSlice';
import changePaymentMethodReducer from './customer/changePaymentMethodSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    customerBasicInfo: customerBasicInfoReducer,
    dropdowns: dropdownsReducer,
    changePaymentMethod: changePaymentMethodReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

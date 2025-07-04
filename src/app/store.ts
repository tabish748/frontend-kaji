import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import loadingReducer from './features/loading/loadingSlice';
import customerBasicInfoReducer from './customer/getCustomerBasicInfoSlice';
import customerDropdownsReducer from './features/dropdowns/getCustomerDropdownsSlice';
import changePaymentMethodReducer from './customer/changePaymentMethodSlice';
import changePlanRequestReducer from './customer/changePlanRequestSlice';
import reactivateRequestReducer from './customer/reactivateRequestSlice';
import changeAddressRequestReducer from './customer/changeAddressRequestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    customerBasicInfo: customerBasicInfoReducer,
    customerDropdowns: customerDropdownsReducer,
    changePaymentMethod: changePaymentMethodReducer,
    changePlanRequest: changePlanRequestReducer,
    reactivateRequest: reactivateRequestReducer,
    changeAddressRequest: changeAddressRequestReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

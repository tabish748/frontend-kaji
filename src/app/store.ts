import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import loadingReducer from './features/loading/loadingSlice';
import customerBasicInfoReducer from './customer/getCustomerBasicInfoSlice';
import customerDropdownsReducer from './features/dropdowns/getCustomerDropdownsSlice';
import adminDropdownsReducer from './features/dropdowns/getAdminDropdownsSlice';
import createCustomerBasicInfoReducer from './customer/createCustomerBasicInfoSlice';
import updateCustomerBasicInfoReducer from './customer/updateCustomerBasicInfoSlice';
import changePaymentMethodReducer from './customer/changePaymentMethodSlice';
import changePlanRequestReducer from './customer/changePlanRequestSlice';
import reactivateRequestReducer from './customer/reactivateRequestSlice';
import changeAddressRequestReducer from './customer/changeAddressRequestSlice';
import changeBillingInfoReducer from './customer/changeBillingInfoSlice';
import addContractPlanReducer from './customer/addContractPlanSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    customerBasicInfo: customerBasicInfoReducer,
    customerDropdowns: customerDropdownsReducer,
    adminDropdowns: adminDropdownsReducer,
    createCustomerBasicInfo: createCustomerBasicInfoReducer,
    updateCustomerBasicInfo: updateCustomerBasicInfoReducer,
    changePaymentMethod: changePaymentMethodReducer,
    changePlanRequest: changePlanRequestReducer,
    reactivateRequest: reactivateRequestReducer,
    changeAddressRequest: changeAddressRequestReducer,
    changeBillingInfo: changeBillingInfoReducer,
    addContractPlan: addContractPlanReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

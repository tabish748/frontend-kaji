import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import loadingReducer from './features/loading/loadingSlice';
import customerBasicInfoReducer from './customer/getCustomerBasicInfoSlice';
import customerBasicInfoAboutReducer from './customer/getCustomerBasicInfoSliceAbout';
import customerDropdownsReducer from './features/dropdowns/getCustomerDropdownsSlice';
import adminDropdownsReducer from './features/dropdowns/getAdminDropdownsSlice';
import customerServicesDropdownsReducer from './features/dropdowns/getCustomerServicesDropdownsSlice';
import createCustomerBasicInfoReducer from './customer/createCustomerBasicInfoSlice';
import updateCustomerBasicInfoReducer from './customer/updateCustomerBasicInfoSlice';
import changePaymentMethodReducer from './customer/changePaymentMethodSlice';
import changePlanRequestReducer from './customer/changePlanRequestSlice';
import reactivateRequestReducer from './customer/reactivateRequestSlice';
import changeAddressRequestReducer from './customer/changeAddressRequestSlice';
import changeBillingInfoReducer from './customer/changeBillingInfoSlice';
import addContractPlanReducer from './customer/addContractPlanSlice';
import getHkServiceReducer from './customer/getHkServiceSlice';
import getHcShowServiceReducer from './customer/getHcShowServiceSlice';
import getHmsShowServiceReducer from './customer/getHmsShowServiceSlice';
import saveHcServiceReducer from './customer/saveHcServiceSlice';
import saveHmsServiceReducer from './customer/saveHmsServiceSlice';
import saveHkServiceReducer from './customer/saveHkServiceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    customerBasicInfo: customerBasicInfoReducer,
    customerBasicInfoAbout: customerBasicInfoAboutReducer,
    customerDropdowns: customerDropdownsReducer,
    adminDropdowns: adminDropdownsReducer,
    customerServicesDropdowns: customerServicesDropdownsReducer,
    createCustomerBasicInfo: createCustomerBasicInfoReducer,
    updateCustomerBasicInfo: updateCustomerBasicInfoReducer,
    changePaymentMethod: changePaymentMethodReducer,
    changePlanRequest: changePlanRequestReducer,
    reactivateRequest: reactivateRequestReducer,
    changeAddressRequest: changeAddressRequestReducer,
    changeBillingInfo: changeBillingInfoReducer,
    addContractPlan: addContractPlanReducer,
    getHkService: getHkServiceReducer,
    getHcShowService: getHcShowServiceReducer,
    getHmsShowService: getHmsShowServiceReducer,
    saveHcService: saveHcServiceReducer,
    saveHmsService: saveHmsServiceReducer,
    saveHkService: saveHkServiceReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

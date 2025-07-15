// getCustomerBasicInfoSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface CustomerRoute {
    id: number;
    customer_id: number;
    date_added: string;
    company: string;
    route_name: string;
    nearest_station: string;
    status: number;
    created_by: number;
    updated_by: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

interface ContractPlanBillingInfo {
    id: number;
    customer_id: number;
    payer_id: number;
    billed_services_id: number | null;
    name: string;
    name_kana: string;
    phone1: string;
    phone1_type: string | null;
    phone2: string | null;
    phone2_type: string | null;
    phone3: string | null;
    phone3_type: string | null;
    email1: string;
    email2: string | null;
    primary_contact_phone: string;
    primary_contact_email: string | null;
    post_code: string;
    prefecture_id: string;
    address1: string;
    address2: string;
    apartment_name: string;
    status: number;
    created_by: number;
    updated_by: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

interface CustomerContractPlan {
    id: number;
    customer_contract_id: number;
    service_id: number;
    contract_plan_id: number | null;
    time: string | null;
    contract_period_start: string | null;
    contract_period_end: string | null;
    service_hours_start: string | null;
    service_hours_end: string | null;
    recurrence_type: string | null;
    interval: string | null;
    days_of_week: string | null;
    time_range: string | null;
    extended_time: string | null;
    is_preferred_language: string | null;
    preferred_language_id: string | null;
    specified: string | null;
    sepcification_details_id: string | null;
    reimbursement_payee: number;
    customer_billing_info_id: number;
    payment_method: number;
    status: number;
    created_by: number;
    updated_by: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    contract_plan_billing_info: ContractPlanBillingInfo;
}

interface CustomerContract {
    id: number;
    customer_id: number;
    contract_type: string | null;
    cont_company_id: number | null;
    deposit: string | null;
    payment_notice_amount: string | null;
    status: number;
    created_by: number;
    updated_by: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    customer_contract_plans: CustomerContractPlan[];
}

interface CustomerLocation {
    customer_location_routes: CustomerRoute[];
    // Add other fields as needed
}

interface ApiCustomerBasicInfo {
    id: number;
    name: string;
    name_kana: string;
    first_name: string;
    last_name: string;
    first_name_kana: string;
    last_name_kana: string;
    represents_id: string;
    dob: string;
    dob_year: string;
    dob_month: string;
    dob_day: string;
    age: number;
    gender: number;
    email1: string;
    email2: string | null;
    phone1_type: string | null;
    phone1: string;
    phone2_type: string | null;
    phone2: string | null;
    phone3_type: string | null;
    phone3: string | null;
    primary_contact_phone: string;
    primary_contact_email: string | null;
    post_code: string | null;
    prefecture_id: number | null;
    address1: string | null;
    address2: string | null;
    apartment_name: string | null;
    newsletter_emails: number;
    language: number;
    discovered_chev: string | null;
    profile_completed: number;
    key_information: Array<{
        status: string;
        receipt: string[];
        user_id: string;
        date_added: string;
        date_returned: string;
    }> | null;
    customer_location_routes: CustomerRoute[];
    customer_contracts: CustomerContract[];
    customer_locations?: CustomerLocation[];
}

interface CustomerBasicInfoState {
    customer: ApiCustomerBasicInfo | null;
    loading: boolean;
    error: string | null;
    message: string | null;
    success: boolean | null;
}

const initialState: CustomerBasicInfoState = {
    customer: null,
    loading: false,
    error: null,
    message: '',
    success: null,
};

export const fetchCustomerBasicInfo = createAsyncThunk(
    'customerBasicInfo/fetchCustomerBasicInfo',
    async () => {
        const endpoint = `/api/customer/basic-info/show`;
        return await ApiHandler.request(endpoint, 'GET');
    }
);

const getCustomerBasicInfoSlice = createSlice({
    name: 'customerBasicInfo',
    initialState,
    reducers: {
        resetCustomerBasicInfo: (state) => {
            state.customer = null;
            state.loading = false;
            state.error = null;
            state.message = '';
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomerBasicInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCustomerBasicInfo.fulfilled, (state, action: PayloadAction<{ data: ApiCustomerBasicInfo, message: string, success: boolean }>) => {
                state.customer = action.payload.data;
                state.loading = false;
                state.message = action.payload.message;
                state.success = true;
            })
            .addCase(fetchCustomerBasicInfo.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.customer = null;
                state.error = action.error.message || null;
            });
    },
});

export default getCustomerBasicInfoSlice.reducer;
export const { resetCustomerBasicInfo } = getCustomerBasicInfoSlice.actions; 
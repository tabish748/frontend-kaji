import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';
interface Inquiry {
    inquiryId: number;
    updatedAt: string;
    customerId: number;
    familyCode: string;
    personalCode: string;
    custName: string;
    custNameKana: string;
    phone1: string;
    phone2?: string; // Optional if not always present
    phone3?: string; // Optional if not always present
    userId?: number; // Optional if not always present
    firstResponder?: string; // Optional if not always present
    firstResponderUsername?: string; // Optional if not always present
    officeId: number;
    officeName?: string; // Optional if not always present
    lastUpdated: string;
    // Add other fields if necessary
}


interface InquiryListState {
    inquiries: any;
    loading: boolean;
    error: string | null;
    message: string | null;
    success: boolean;
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    fromPage: number;
    toPage: number;
}
interface ApiResponseInquiry {
    first_inquiry_date: any;
    approach_way: any;
    first_inquiry: any;
    uniform_id: any;
    inquiry_id: number;
    updated_at: string;
    customer_id: number;
    family_code: string;
    personal_code: string;
    cust_name: string;
    project_category: string;
    project_category_status: number;
    customer_situation: number;
    cust_name_kana: string;
    phone1: string;
    phone2: string;
    phone3: string;
    user_id: number;
    first_responder: string;
    first_responder_username: string;
    office_id: number;
    office_name: string;
    last_updated: string;
    last_updated_by: string;
    // Add other fields if necessary
}

const initialState: InquiryListState = {
    inquiries: [],
    loading: false,
    error: null,
    message: '',
    success: false,
    currentPage: 1,
    lastPage: 1,
    perPage: 50, // assuming a default of 50, adjust if necessary
    total: 0,
    fromPage: 0,
    toPage: 0,
};

export const fetchInquiries = createAsyncThunk(
    'inquiryList/fetchInquiries',
    async (params?: {
        page?: number;
        limit?: any;
        // Add other parameters if necessary
    }) => {
        const endpoint = '/api/inquiry-listing';
        const stringifiedParams: Record<string, string> = {};
        if (params) {
            for (const key in params) {
                const strictKey = key as keyof typeof params;
                if (params[strictKey] !== undefined) {
                    stringifiedParams[strictKey] = params[strictKey]!.toString();
                }
            }
        }
        try {
            return await ApiHandler.request(endpoint, 'GET', undefined, stringifiedParams);
        } catch (error) {
            throw error;
        }
    }
);

const inquiryListSlice = createSlice({
    name: 'inquiryList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInquiries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInquiries.fulfilled, (state, action: PayloadAction<{ data: { data: ApiResponseInquiry[], current_page: number, last_page: number, per_page: number, total: number, from: number, to: number }, message: string, success: boolean }>) => {
                state.inquiries = action.payload.data.data?.map(apiInquiry => ({
                    inquiryId: apiInquiry.inquiry_id,
                    customerId: apiInquiry.customer_id,
                    uniformId: apiInquiry.uniform_id,
                    familyCode: apiInquiry.family_code,
                    approach: apiInquiry.approach_way,
                    personalCode: apiInquiry.personal_code,
                    customerName: apiInquiry.cust_name,
                    customerNameKana: apiInquiry.cust_name_kana,
                    projectType: apiInquiry.project_category,
                    projectStatus: apiInquiry.project_category_status,
                    firstInquiryDate: apiInquiry.first_inquiry_date,
                    customerSituation: apiInquiry.customer_situation,
                    phone1: apiInquiry.phone1,
                    firstInquiry: apiInquiry.first_inquiry,
                    phone2: apiInquiry.phone2,
                    phone3: apiInquiry.phone3,
                    officeId: apiInquiry.office_id,
                    officeName: apiInquiry.office_name,
                    firstResponder: apiInquiry.first_responder,
                    lastUpdated: apiInquiry.updated_at,
                    lastResponder: apiInquiry.last_updated_by,
                    // map other properties as necessary
                }));
                state.currentPage = action.payload.data.current_page;
                state.lastPage = action.payload.data.last_page;
                state.perPage = action.payload.data.per_page;
                state.total = action.payload.data.total;
                state.fromPage = action.payload.data.from;
                state.toPage = action.payload.data.to;
                state.loading = false;
                state.message = action.payload.message;
                state.success = action.payload.success;
            })
            .addCase(fetchInquiries.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.error.message || null;
            });
    },
});

export default inquiryListSlice.reducer;

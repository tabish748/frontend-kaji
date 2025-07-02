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
    errorMessages: any;
    currentPage: number;
    fileToDownload: any;
    lastPage: number;
    perPage: number;
    total: number;
    fromPage: number;
    toPage: number;
}
interface ApiResponseInquiry {
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
    errorMessages: null,
    message: '',
    success: false,
    currentPage: 1,
    fileToDownload: null,
    lastPage: 1,
    perPage: 50, // assuming a default of 50, adjust if necessary
    total: 0,
    fromPage: 0,
    toPage: 0,
};

export const fetchInquiriesListDownload = createAsyncThunk(
    'inquiryList/fetchInquiriesListDownload',
    async (params: {
        page?: number;
    } = {},
    { rejectWithValue }) => {
        const endpoint = '/api/inquiry-export';
        const stringifiedParams: Record<string, string> = {};

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    stringifiedParams[key] = value.toString();
                }
            });
        }

        try {
            return await ApiHandler.request(endpoint, 'GET', undefined, stringifiedParams);
        } catch (error) {
            return rejectWithValue(error as any);
        }
    }
);


const inquiryListSlice = createSlice({
    name: 'inquiryList',
    initialState,
    reducers: {
        resetInquiryListDownloadState: (state) => {
            state.errorMessages = null;
            state.message = null;
            state.success = false;
            state.loading = false;
            state.fileToDownload = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInquiriesListDownload.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInquiriesListDownload.fulfilled, (state, action: PayloadAction<{ data: {
                file_path: any; data: ApiResponseInquiry[], current_page: number, last_page: number, per_page: number, total: number, from: number, to: number 
}, message: string, success: boolean }>) => {
                state.inquiries = action.payload.data.data?.map(apiInquiry => ({
                    inquiryId: apiInquiry.inquiry_id,
                    customerId: apiInquiry.customer_id,
                    uniformId: apiInquiry.uniform_id,
                    familyCode: apiInquiry.family_code,
                    personalCode: apiInquiry.personal_code,
                    customerName: apiInquiry.cust_name,
                    customerNameKana: apiInquiry.cust_name_kana,
                    projectType: apiInquiry.project_category,
                    projectStatus: apiInquiry.project_category_status,
                    customerSituation: apiInquiry.customer_situation,
                    phone1: apiInquiry.phone1,
                    phone2: apiInquiry.phone2,
                    phone3: apiInquiry.phone3,
                    officeId: apiInquiry.office_id,
                    officeName: apiInquiry.office_name,
                    firstResponder: apiInquiry.first_responder,
                    lastUpdated: apiInquiry.updated_at,
                    lastResponder: apiInquiry.last_updated_by,
                    // map other properties as necessary
                }));
                state.fileToDownload = action.payload.data?.file_path;
                state.currentPage = action.payload.data.current_page;
                state.lastPage = action.payload.data.last_page;
                state.perPage = action.payload.data.per_page;
                state.total = action.payload.data.total;
                state.fromPage = action.payload.data.from;
                state.toPage = action.payload.data.to;
                state.loading = false;
                state.message = action.payload.message;
                state.success = true;
            })
            .addCase(fetchInquiriesListDownload.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                const errorPayload = action.payload as { errors?: Record<string, string[]> };
                const errorMessagesArray = Object.values(errorPayload?.errors || {}).flat();
                state.errorMessages = errorMessagesArray.length ? errorMessagesArray : [action.error.message || 'Unknown error'];
            });
    },
});

export const { resetInquiryListDownloadState } = inquiryListSlice.actions;
export default inquiryListSlice.reducer;

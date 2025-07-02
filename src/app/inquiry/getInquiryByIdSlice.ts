// getInquiryByIdSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import ApiHandler from '@/app/api-handler';

interface ApiInquiryDetail {
    approach_way_by_line_id: any;
    corresponding_person_id: string;
    interviewer1_office_id: string;
    id: number;
    customer_id: number;
    subject: string;
    message: string;
    status: string;
    created_at: string;
    updated_at: string;
    uniform_id: string;

    // Additional properties based on your usage
    first_inquiry_date_hour: string;
    approach_way_id: string;
    search_keyword: string;
    project_category: string;
    project_category_status: string;
    customer_situation: string;
    newsletter: string;
    introduced_by_id: number;
    interview_appoint: string;
    interviewer1: string;
    interviewer2: string;
    interviewer3: string;
    interview_date: string;
    interview_date_hour_min: string;
    location_id: string;
    remarks: string;
    approach_office_id: any;
    approach_number: any;

    customer: {
        gender: any;
        relation: string;
        id: number;
        family_code: string;
        first_name: string;
        last_name: string;
        first_name_kana: string;
        last_name_kana: string;
        personal_code: string;
        age: number;
        actual_age: any;
        day: string;
        year: string;
        month: string;
        phone_type1: string;
        phone_type2: string;
        phone_type3: string;
        phone1: string;
        phone2: string;
        phone3: string;
        zipcode: string;
        prefecture_id: string;
        address: string;
        newsletter: string;
        email: string;
        email2: string;
        primary_contact: any;
    };

    family_codes_id: string;
    inquiry_details: any;
}


interface InquiryDetailState {
    inquiry: ApiInquiryDetail | null;
    loading: boolean;
    error: string | null;
    message: string | null;
    success: boolean | null;
}

const initialState: InquiryDetailState = {
    inquiry: null,
    loading: false,
    error: null,
    message: '',
    success: null,
};

export const fetchInquiryById = createAsyncThunk(
    'inquiryDetail/fetchInquiryById',
    async (id: number) => {
        const endpoint = `/api/inquiry-show/${id}`;
        return await ApiHandler.request(endpoint, 'GET');
    }
);

const getInquiryByIdSlice = createSlice({
    name: 'inquiryDetail',
    initialState,
    reducers: {
        resetInquiryDetail: (state) => {
            state.inquiry = null;
            state.loading = false;
            state.error = null;
            state.message = '';
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInquiryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInquiryById.fulfilled, (state, action: PayloadAction<{ data: ApiInquiryDetail, message: string, success: boolean }>) => {
                state.inquiry = action.payload.data;
                state.loading = false;
                state.message = action.payload.message;
                state.success = true;
                // alert('test')
            })
            .addCase(fetchInquiryById.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.inquiry = null;
                state.error = action.error.message || null;
            });
    },
});

export default getInquiryByIdSlice.reducer;
export const { resetInquiryDetail } = getInquiryByIdSlice.actions;

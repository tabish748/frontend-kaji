// features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import ApiHandler from "@/app/api-handler";
import { USER_TYPE } from "@/libs/constants";

interface User {
  id: number;
  name: string;
  name_kana: string | null;
  email: string;
  represents: string | null;
  address: string;
  age: number;
  apartment_name: string;
  created_at: string;
  created_by: number;
  deleted_at: string | null;
  discovered_chev: string | null;
  dob: string;
  email1: string | null;
  email2: string | null;
  email_verified_at: string;
  gender: number;
  languages: string | null;
  nearest_station: string;
  newsletter_emails: number;
  phone1: string;
  phone2: string | null;
  phone3: string | null;
  phone_type1: string;
  phone_type2: string | null;
  phone_type3: string | null;
  post_code: string;
  prefecture_id: number;
  primary_contact: string;
  route_name: string;
  station_company: string;
  status: number;
  updated_at: string;
  updated_by: number;
}

interface Authorization {
  token: string;
  type: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  authorization: Authorization | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean | null;
  userRole: { name: string; id?: number };
}

interface Department {
  id: number;
  name: string;
}

interface Office {
  id: number;
  name: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  authorization: null,
  loading: false,
  error: null,
  message: "",
  success: null,
  userRole: {
    name: ""
  },
};

type PayloadType = {
  message: string;
  //... other fields if there are any
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ formData, loginType = USER_TYPE.customer }: { formData: FormData; loginType?: string }) => {
    try {
      const endpoint = loginType === USER_TYPE.admin ? "/api/contractor/login" : "/api/customer/login";
      
      const response = await ApiHandler.request(
        endpoint,
        "POST",
        formData,
        undefined,
        undefined,
        false // Don't require token for login
      );

      // Store token in localStorage if it's in the response
      if (response.data?.authorization?.token) {
        localStorage.setItem("token", response.data.authorization.token);
      }

      return response;
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (formData: FormData) => {
    try {
      const response = await ApiHandler.request(
        "/api/forgot-password/customer",
        "POST",
        formData,
        undefined,
        undefined,
        false // Don't require token for forgot password
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || "Password reset request failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthSlice: (state) => {
      state.success = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.authorization = null;
      state.message = null;

      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("token"); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: {
              user: User;
              authorization: Authorization;
              role?: any;
            };
            message: string;
            success: boolean;
          }>
        ) => {
          state.isAuthenticated = true;
          state.user = action.payload.data.user;
          state.authorization = action.payload.data.authorization;
          state.loading = false;
          state.message = action.payload.message;
          state.success = action.payload.success;
          state.userRole = action.payload.data.role.label;

          // Store relevant user info in localStorage
          const userName = state.user.name;
          const userId = state.user.id;
          if (state.user) {
            localStorage.setItem("loggedInUser", JSON.stringify({...state.user, userRole: state.userRole}));
          }

          if (state.userRole?.id) {
            localStorage.setItem("loggedInUserRoleId", String(state.userRole.id));
          }
          if (state.authorization?.token) {
            localStorage.setItem("token", state.authorization.token);
          }
        }
      )
      .addCase(login.rejected, (state, action) => {
        const payload = action.payload as PayloadType;

        state.isAuthenticated = false;
        state.user = null;
        state.authorization = null;
        state.loading = false;
        state.success = false;
        state.userRole = { name: "" };
        if (action.error.message) {
          state.message = action.error.message;
        } else {
          state.message = null;
        }
      });
  },
});
export const { logout } = authSlice.actions;

export default authSlice.reducer;
export const { resetAuthSlice } = authSlice.actions;

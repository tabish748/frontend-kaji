// features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  team_id: number;
  office_departments_id: number;
  first_name: string;
  last_name: string;
  first_name_kana: string;
  last_name_kana: string;
  username: string;
  email: string | null;
  mobile: string | null;
  email_verified_at: string;
  is_sales: number;
  is_teamleader: number;
  is_judicial: number;
  status: number;
  created_by: number;
  updated_by: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  csrfToken: string
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
  userDepartment: Department | null;
  userOffice: Office | null;
  userCity: Office | null;
  userTeam?: number | null;
  userRole?: any;
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
  message: '',
  success: null,
  userDepartment: null,
  userOffice: null,
  userCity: null,
  userTeam: null,
  userRole: {name: "client"}
};

type PayloadType = {
  message: string;
  //... other fields if there are any
};


export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password, office_id }: { username: string; password: string, office_id: string }) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const response = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // Include cookies
      body: JSON.stringify({ username, password, office_id }),
    });
    if (!response.ok) {
      const data = await response.json();
      
      throw new Error(data.message || 'Failed to login');
    }
    return await response.json();

  }
);

const authSlice = createSlice({
  name: 'auth',
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
      // Reset any other state if needed
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{
        data: {
          user: User,
          authorization: Authorization,
          user_department?: Department,
          user_office?: Office,
          user_city?: Office,
          role?: any,
        },
        message: string,
        success: boolean,

      }>) => {

        let userDepartmentObj: Department | null = action.payload.data.user_department
          ? {
            id: action.payload.data.user_department.id,
            name: action.payload.data.user_department.name,
          }
          : null;

        let userOfficeObj: Office | null = action.payload.data.user_office
          ? {
            id: action.payload.data.user_office.id,
            name: action.payload.data.user_office.name,
          }
          : null;
        let userCityObj: Office | null = action.payload.data.user_city
          ? {
            id: action.payload.data.user_city.id,
            name: action.payload.data.user_city.name,
          }
          : null;

        let userRole: Office | null = action.payload.data.user_city
          ? {
            id: action.payload.data.role.id,
            name: action.payload.data.role.name,
          }
          : null;


        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.authorization = action.payload.data.authorization;
        state.loading = false;
        state.message = action.payload.message;
        state.success = true;
        state.userDepartment = userDepartmentObj;
        state.userOffice = userOfficeObj;
        state.userCity = userCityObj;
        state.userRole = userRole;
        state.userTeam = action.payload.data?.user?.team_id;
        const userName = state.user.first_name + " " + state.user.last_name;
        const userId = state.user.id ;
        localStorage.setItem('loggedInUserName', userName);
        localStorage.setItem('loggedInUserId', String(userId));
        localStorage.setItem('loggedInUserRoleId', state.userRole.id);
        localStorage.setItem('employeeIdSozoku', String(action?.payload?.data?.user?.id))
      })
      .addCase(login.rejected, (state, action) => {
        const payload = action.payload as PayloadType;

        state.isAuthenticated = false;
        state.user = null;
        state.authorization = null;
        state.loading = false;
        state.success = false;
        // state.error = payload.message;
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
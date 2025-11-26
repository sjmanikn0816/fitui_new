import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { Endpoints } from "@/constants/endpoints";
import api from '@/services/api';


interface ChangePasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordState {
  loading: boolean;
  success: boolean;
  error: string | null;
}


const initialState: ChangePasswordState = {
  loading: false,
  success: false,
  error: null,
};


export const changePassword = createAsyncThunk(
  'password/changePassword',
  async (passwordData: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      const deviceId = await DeviceInfo.getUniqueId();
      const response = await api.patch(
         `${Endpoints.USER.CHANGE_PASSWORD}`,
        {
          email: passwordData.email,
          currentPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            "X-Device-ID": deviceId,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Failed to change password');
      }
      return rejectWithValue('Network error. Please try again.');
    }
  }
);


const changePasswordSlice = createSlice({
  name: 'changePassword',
  initialState,
  reducers: {
    resetPasswordState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetPasswordState, clearError } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;
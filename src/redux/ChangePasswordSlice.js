// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { agentUpdatePassword, ApiBaseUrl, getResult, issueReports, updatePassword } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitChangePassword = createAsyncThunk("hitChangePassword", async (payload,from) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };

    const url = ApiBaseUrl + (from==1?updatePassword:agentUpdatePassword);
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.put(url,payload,config);
    console.log("Response Change Password===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const ChangePasswordSlice = createSlice({
  name: "changePasswordReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearChangePassword: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitChangePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitChangePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitChangePassword.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearChangePassword } = ChangePasswordSlice.actions;
export default ChangePasswordSlice.reducer;
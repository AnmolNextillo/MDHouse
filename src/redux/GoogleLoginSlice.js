// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, googleLogin } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitGoogleLogin = createAsyncThunk("hitGoogleLogin", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + googleLogin;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.post(url,payload,config);
    console.log("Response Google Login===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const GoogleLoginSlice = createSlice({
  name: "googleLoginReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGoogleLogin: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGoogleLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGoogleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGoogleLogin.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearGoogleLogin } = GoogleLoginSlice.actions;
export default GoogleLoginSlice.reducer;
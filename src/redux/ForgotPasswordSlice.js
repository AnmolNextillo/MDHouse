// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, forgot } from "../utils/constants";

export const hitForgotPassword = createAsyncThunk("hitForgotPassword", async (payload) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("Payload ===> ",payload)
    const url = ApiBaseUrl + forgot; 
    console.log("url ===> ",url)
    const response = await axios.post(url, payload, config);
    console.log("Response Forgot===> ",response.data)
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

const ForgotPasswordSlice = createSlice({
  name: "forgotReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearForgotPassword: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitForgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitForgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitForgotPassword.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearForgotPassword } = ForgotPasswordSlice.actions;
export default ForgotPasswordSlice.reducer;
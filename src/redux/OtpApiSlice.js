// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { agentOtp, ApiBaseUrl, studentOtp } from "../utils/constants";

export const hitOtpApi = createAsyncThunk("hitOtpApi", async (payload) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const type = payload.type; // "student" or "partner"
    const url = ApiBaseUrl + (type == 3 ? agentOtp : studentOtp);
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.put(url,payload,config);
    console.log("Response Otp ===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const OtpApiSlice = createSlice({
  name: "otpApiReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearOtpData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitOtpApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitOtpApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitOtpApi.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearOtpData } = OtpApiSlice.actions;
export default OtpApiSlice.reducer;

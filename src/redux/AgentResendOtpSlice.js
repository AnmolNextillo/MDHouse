// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { agentResendOtp, ApiBaseUrl, studentResendOtp } from "../utils/constants";

export const hitResendOtpApi = createAsyncThunk("hitResendOtpApi", async (payload) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const type = payload.type; // "student" or "partner"
    const url = ApiBaseUrl + (type == 3 ? agentResendOtp : studentResendOtp);
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.put(url,payload,config);
    console.log("Response resend api Otp ===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const AgentResendOtpApiSlice = createSlice({
  name: "resendOtpApiReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearResendOtpData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitResendOtpApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitResendOtpApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitResendOtpApi.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearResendOtpData } = AgentResendOtpApiSlice.actions;
export default AgentResendOtpApiSlice.reducer;

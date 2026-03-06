// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, signUp } from "../utils/constants";

export const hitSignup = createAsyncThunk("hitSignup", async (payload) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const url = ApiBaseUrl + signUp;      
      console.log('Payload Sign Up ===> ', payload);
    const response = await axios.post(url, payload, config);
    console.log("Response ===> ",response.data)
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
});

const SignUpSlice = createSlice({
  name: "signupReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearSignupData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitSignup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitSignup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitSignup.rejected, (state) => {
        state.isError = false;
        console.log("Error ===> ",state)
      });
  },
});

export const { clearSignupData } = SignUpSlice.actions;
export default SignUpSlice.reducer;
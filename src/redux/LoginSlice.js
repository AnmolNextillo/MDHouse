// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, login, loginV2, partnerLogin } from "../utils/constants";

export const hitLogin = createAsyncThunk("hitLogin", async (payload) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log("Payload ===> ", payload)
    const url = ApiBaseUrl + (payload.studentType === "partner" ? partnerLogin : loginV2);
    console.log("url ===> ", url)
    const response = await axios.post(url, payload, config);
    console.log("Response ===> ", response.data)
    return response.data;
  } catch (error) {
    console.log("Error ===> ", error.response.data)
    throw error.response.data;
  }
});

const LoginSlice = createSlice({
  name: "loginReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearLoginData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitLogin.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearLoginData } = LoginSlice.actions;
export default LoginSlice.reducer;
// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, checkUser, getResult, issueReports } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitCheckUser = createAsyncThunk("hitCheckUser", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + checkUser;
    console.log("URL ====> ",url)
    const response = await axios.get(url,config);
    console.log("Response check User===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const CheckUserSlice = createSlice({
  name: "checkUserReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetIssue: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitCheckUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitCheckUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitCheckUser.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearGetIssue } = CheckUserSlice.actions;
export default CheckUserSlice.reducer;
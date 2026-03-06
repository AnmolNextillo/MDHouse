// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, getResult, issueReports } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitGetIssue = createAsyncThunk("hitGetIssue", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + issueReports;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.get(url,config);
    console.log("Response Get Issue===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const GetIssueSlice = createSlice({
  name: "getIssueReducer",

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
      .addCase(hitGetIssue.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetIssue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetIssue.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearGetIssue } = GetIssueSlice.actions;
export default GetIssueSlice.reducer;
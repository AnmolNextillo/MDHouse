// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, getResult, issueReports } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitPostIssue = createAsyncThunk("hitPostIssue", async (payload) => {
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
    const response = await axios.post(url,payload,config);
    console.log("Response Post Issue===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const PostIssueSlice = createSlice({
  name: "postIssueReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearPostIssue: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitPostIssue.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitPostIssue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitPostIssue.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearPostIssue } = PostIssueSlice.actions;
export default PostIssueSlice.reducer;
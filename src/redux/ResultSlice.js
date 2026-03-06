// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, getResult } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitResult = createAsyncThunk("hitResult", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + getResult+"?semester="+payload;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.get(url,config);
    console.log("Response Get Profile===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const ResultSlice = createSlice({
  name: "resultReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearResult: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitResult.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitResult.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitResult.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearResult } = ResultSlice.actions;
export default ResultSlice.reducer;
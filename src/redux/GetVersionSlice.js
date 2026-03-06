// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, versions } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitVersionApi = createAsyncThunk("hitVersionApi", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + versions;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.get(url);
    console.log("Response Get Profile===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const GetVersionSlice = createSlice({
  name: "getVersionReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetVersion: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitVersionApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitVersionApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitVersionApi.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearGetVersion } = GetVersionSlice.actions;
export default GetVersionSlice.reducer;
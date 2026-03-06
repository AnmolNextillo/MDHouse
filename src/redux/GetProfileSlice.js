// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, profile } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitGetProfile = createAsyncThunk("hitGetProfile", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + profile;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.get(url,config);
    console.log("Response Get Profile===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const GetProfileSlice = createSlice({
  name: "getProfileReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetProfile: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGetProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetProfile.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearGetProfile } = GetProfileSlice.actions;
export default GetProfileSlice.reducer;
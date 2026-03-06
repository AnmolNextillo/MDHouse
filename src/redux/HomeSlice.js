// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, home } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitHome= createAsyncThunk("hitHome", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + home;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.get(url,config);
    console.log("Response Home===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const HomeSlice = createSlice({
  name: "homeReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearHome: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitHome.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitHome.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitHome.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearHome } = HomeSlice.actions;
export default HomeSlice.reducer;
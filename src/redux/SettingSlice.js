// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, getResult, issueReports, settings } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitSetting = createAsyncThunk("hitSetting", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + settings;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.post(url,payload,config);
    console.log("Response Get Issue===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const SettingSlice = createSlice({
  name: "settingReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearSetting: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitSetting.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitSetting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitSetting.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearSetting } = SettingSlice.actions;
export default SettingSlice.reducer;
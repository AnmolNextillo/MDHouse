// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { agentNotifications, ApiBaseUrl, notifications } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitNotificationApi = createAsyncThunk("hitNotificationApi", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const storedUserType = await AsyncStorage.getItem("userType");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + (storedUserType == 3 ? agentNotifications : notifications);
    console.log("URL ====> ",url)
    const response = await axios.get(url,config);
    console.log("Response Get Notifications===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const GetNotificationsSlice = createSlice({
  name: "getNotificationsReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetNotifications: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitNotificationApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitNotificationApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitNotificationApi.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearGetNotifications } = GetNotificationsSlice.actions;
export default GetNotificationsSlice.reducer;
// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { agentNotifications, ApiBaseUrl, notifications, adminSendNotifications, adminSendNotificationSingle, adminGetAllNotifications } from "../utils/constants";
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

export const hitGetAllNotifications = createAsyncThunk(
  "hitGetAllNotifications",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      };
      const url = ApiBaseUrl + adminGetAllNotifications;
      const response = await axios.post(url, payload || {}, config);
      console.log("Response Get All Notifications ===>", response.data);
      return response.data;
    } catch (error) {
      console.log("Get All Notifications Error ===>", error);
      throw (error.response && error.response.data) || error;
    }
  }
);

export const hitSendNotification = createAsyncThunk(
  "hitSendNotification",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      };
      const url = ApiBaseUrl + adminSendNotifications;
      const response = await axios.post(url, payload, config);
      console.log("Response Send Notification ===>", response.data);
      return response.data;
    } catch (error) {
      console.log("Send Notification Error ===>", error);
      throw (error.response && error.response.data) || error;
    }
  }
);

export const hitSendNotificationSingle = createAsyncThunk(
  "hitSendNotificationSingle",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      };
      const url = ApiBaseUrl + adminSendNotificationSingle;
      const response = await axios.post(url, payload, config);
      console.log("Response Send Notification Single ===>", response.data);
      return response.data;
    } catch (error) {
      console.log("Send Notification Single Error ===>", error);
      throw (error.response && error.response.data) || error;
    }
  }
);

const GetNotificationsSlice = createSlice({
  name: "getNotificationsReducer",

  initialState: {
    isLoading: false,
    data: null,
    isSending: false,
    sendData: null,
    sendError: null,
    isSendingSingle: false,
    sendSingleData: null,
    sendSingleError: null,
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
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(hitGetAllNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetAllNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetAllNotifications.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(hitSendNotification.pending, (state) => {
        state.isSending = true;
        state.sendError = null;
      })
      .addCase(hitSendNotification.fulfilled, (state, action) => {
        state.isSending = false;
        state.sendData = action.payload;
      })
      .addCase(hitSendNotification.rejected, (state, action) => {
        state.isSending = false;
        state.sendError = action.error?.message || "Failed to send notification";
      })
      .addCase(hitSendNotificationSingle.pending, (state) => {
        state.isSendingSingle = true;
        state.sendSingleError = null;
      })
      .addCase(hitSendNotificationSingle.fulfilled, (state, action) => {
        state.isSendingSingle = false;
        state.sendSingleData = action.payload;
      })
      .addCase(hitSendNotificationSingle.rejected, (state, action) => {
        state.isSendingSingle = false;
        state.sendSingleError = action.error?.message || "Failed to send notification";
      });
  },
});

export const { clearGetNotifications } = GetNotificationsSlice.actions;
export default GetNotificationsSlice.reducer;
// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, sendMessage } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitSendMessage = createAsyncThunk("hitSendMessage", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + sendMessage;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.post(url,payload,config);
    console.log("Response Send Message===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const SendMessageSlice = createSlice({
  name: "setMessageReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearSendMessage: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitSendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitSendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitSendMessage.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearSendMessage } = SendMessageSlice.actions;
export default SendMessageSlice.reducer;
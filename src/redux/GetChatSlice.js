// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, getChat, getChatWithAdmin } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitChatApi = createAsyncThunk("hitChatApi", async (payload) => {
  try {
    const storedUserType = await AsyncStorage.getItem("userType");
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    console.log("Stored User Type ===> ",storedUserType)
    const url = ApiBaseUrl + (storedUserType == 3 ? getChatWithAdmin : getChat);
    console.log("URL ====> ",url)
    const response =  storedUserType == 3 ?await axios.post(url,payload,config) :await axios.get(url,config);
    console.log("Response Get chat===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const GetChatSlice = createSlice({
  name: "getChatReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearChat: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitChatApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitChatApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitChatApi.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearChat } = GetChatSlice.actions;
export default GetChatSlice.reducer;
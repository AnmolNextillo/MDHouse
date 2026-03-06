// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, getAttendance } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitAttendance = createAsyncThunk("hitAttendance", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + getAttendance+"?semester="+payload;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.get(url,config);
    console.log("Response Get getAttendance===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const AttendanceSlice = createSlice({
  name: "attendanceReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAttendance: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAttendance.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearAttendance } = AttendanceSlice.actions;
export default AttendanceSlice.reducer;
// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { agentDashboard, ApiBaseUrl, dashboard, getChat } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitDashboardApi = createAsyncThunk("hitDashboardApi", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const storedUserType = await AsyncStorage.getItem("userType");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + (storedUserType == 3 ? agentDashboard : dashboard);
    console.log("URL ====> ",url)
    const response = await axios.get(url,config);
    console.log("Response Dashboard===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const DashboardSlice = createSlice({
  name: "dashboardReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearDashboard: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitDashboardApi.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitDashboardApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitDashboardApi.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearDashboard } = DashboardSlice.actions;
export default DashboardSlice.reducer;
// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl,studentAchievements } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitAchivements= createAsyncThunk("hitAchivements", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + studentAchievements;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.get(url,config);
    console.log("Response Achivements===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const AchivemenstsSlice = createSlice({
  name: "achivementsReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAchivements: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAchivements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAchivements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAchivements.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearAchivements } = AchivemenstsSlice.actions;
export default AchivemenstsSlice.reducer;
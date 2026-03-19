// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { agentUpdateProfile, ApiBaseUrl, updateProfile } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitUpdateProfile = createAsyncThunk("hitUpdateProfile", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + agentUpdateProfile;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.post(url,payload,config);
    console.log("Response Update Profile===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const AgentUpdateProfileSlice = createSlice({
  name: "agentUpdateProfileReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearUpdateProfile: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitUpdateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitUpdateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitUpdateProfile.rejected, (state) => {
        console.log("Error ===> ",state)
        state.isError = false;
      });
  },
});
export const { clearUpdateProfile } = AgentUpdateProfileSlice.actions;
export default AgentUpdateProfileSlice.reducer;
// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { agentStudentList, agentUpdateProfile, ApiBaseUrl, updateProfile } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitAgentStudentList = createAsyncThunk("hitAgentStudentList", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + agentStudentList;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.post(url,payload,config);
    console.log("Response Agent Student List ===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const AgentStudentListSlice = createSlice({
  name: "agentStudentListReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAgentStudentList: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAgentStudentList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAgentStudentList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAgentStudentList.rejected, (state) => {
        console.log("Error ===> ",state)
        state.isError = false;
      });
  },
});
export const { clearAgentStudentList } =   AgentStudentListSlice.actions;
export default AgentStudentListSlice.reducer;
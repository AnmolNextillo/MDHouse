// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { agentAddStudent, agentUpdateProfile, ApiBaseUrl, updateProfile } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitAgentAddStudent = createAsyncThunk("hitAgentAddStudent", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + agentAddStudent;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.post(url,payload,config);
    console.log("Response Update Profile===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const AgentAddStudentSlice = createSlice({
  name: "agentAddStudentReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAgentAddStudent: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAgentAddStudent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAgentAddStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAgentAddStudent.rejected, (state) => {
        console.log("Error ===> ",state)
        state.isError = false;
      });
  },
});
export const { clearAgentAddStudent } = AgentAddStudentSlice.actions;
export default AgentAddStudentSlice.reducer;
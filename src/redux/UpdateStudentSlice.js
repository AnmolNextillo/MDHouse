// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { agentAddStudent, agentUpdateStudent, ApiBaseUrl, } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitUpdateStudent = createAsyncThunk("hitUpdateStudent", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + agentUpdateStudent;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.put(url,payload,config);
    console.log("Response Update Profile===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const UpdateStudentSlice = createSlice({
  name: "updateStudentReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearUpdateStudent: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitUpdateStudent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitUpdateStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitUpdateStudent.rejected, (state) => {
        console.log("Error ===> ",state)
        state.isError = false;
      });
  },
});
export const { clearUpdateStudent } = UpdateStudentSlice.actions;
export default UpdateStudentSlice.reducer;
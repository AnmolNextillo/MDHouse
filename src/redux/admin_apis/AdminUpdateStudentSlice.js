// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminUpdateStudent, ApiBaseUrl } from "../../utils/constants";

export const hitAdminUpdateStudent = createAsyncThunk("hitAdminUpdateStudent", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + adminUpdateStudent;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.put(url,payload,config);
    console.log("Response Update Profile===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const AdminUpdateStudentSlice = createSlice({
  name: "adminUpdateStudentReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminUpdateStudent: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminUpdateStudent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminUpdateStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminUpdateStudent.rejected, (state) => {
        console.log("Error ===> ",state)
        state.isError = false;
      });
  },
});
export const { clearAdminUpdateStudent } = AdminUpdateStudentSlice.actions;
export default AdminUpdateStudentSlice.reducer;
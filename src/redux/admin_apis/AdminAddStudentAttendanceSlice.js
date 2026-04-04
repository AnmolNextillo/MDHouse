import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiBaseUrl, adminAddStudentAttendance } from "../../utils/constants";

export const hitAddStudentAttendance = createAsyncThunk(
  "hitAddStudentAttendance",
  async ({ studentId, resultArray }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      };
      const payload = {
        studentId,
        resultArray,
      };
      const url = ApiBaseUrl + adminAddStudentAttendance;
      const response = await axios.post(url, payload, config);
      console.log("Response addStudentAttendance ===>", response.data);
      return response.data;
    } catch (error) {
      console.log("Error addStudentAttendance ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AddStudentAttendanceSlice = createSlice({
  name: "adminAddStudentAttendanceReducer",
  initialState: {
    isLoading: false,
    data: null,
    error: null,
  },
  reducers: {
    clearAddStudentAttendance: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAddStudentAttendance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAddStudentAttendance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAddStudentAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Unable to save student attendance";
      });
  },
});

export const { clearAddStudentAttendance } = AddStudentAttendanceSlice.actions;
export default AddStudentAttendanceSlice.reducer;

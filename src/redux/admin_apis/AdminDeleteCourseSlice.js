import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminDeleteCourse, ApiBaseUrl } from "../../utils/constants";

export const hitAdminDeleteCourse = createAsyncThunk(
  "hitAdminDeleteCourse",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminDeleteCourse;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.delete(url, {
        ...config,
        data: payload
      });

      console.log("Request Payload:", payload);
      console.log("Response Delete Course ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminDeleteCourseSlice = createSlice({
  name: "adminDeleteCourseReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminDeleteCourse: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminDeleteCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminDeleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminDeleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAdminDeleteCourse } = AdminDeleteCourseSlice.actions;
export default AdminDeleteCourseSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminUpdateCourse, ApiBaseUrl } from "../../utils/constants";

export const hitAdminUpdateCourse = createAsyncThunk(
  "hitAdminUpdateCourse",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminUpdateCourse;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.put(url, payload, config);

      console.log("Request Payload:", payload);
      console.log("Response Update Course ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminUpdateCourseSlice = createSlice({
  name: "adminUpdateCourseReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminUpdateCourse: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminUpdateCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminUpdateCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminUpdateCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAdminUpdateCourse } = AdminUpdateCourseSlice.actions;
export default AdminUpdateCourseSlice.reducer;
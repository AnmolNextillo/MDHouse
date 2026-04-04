import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminAddCourse, ApiBaseUrl } from "../../utils/constants";

export const hitAdminAddCourse = createAsyncThunk(
  "hitAdminAddCourse",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminAddCourse;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.post(url, payload, config);

      console.log("Request Payload:", payload);
      console.log("Response Add Course ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminAddCourseSlice = createSlice({
  name: "adminAddCourseReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminAddCourse: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminAddCourse.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminAddCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminAddCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAdminAddCourse } = AdminAddCourseSlice.actions;
export default AdminAddCourseSlice.reducer;
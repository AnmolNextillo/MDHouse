import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminCourses, ApiBaseUrl } from "../../utils/constants";

export const hitGetCourses = createAsyncThunk(
  "hitGetCourses",
  async ({ start = 0, length = 10, search = "" } = {}) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminCourses;

      const payload = {
        start,
        length,
        search,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.post(url, payload, config);

      console.log("Request URL:", `${url}?start=${start}&length=${length}&search=${search}`);
      console.log("Request Payload:", payload);
      console.log("Response Courses ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const GetCoursesSlice = createSlice({
  name: "getCoursesReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetCourses: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGetCourses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearGetCourses } = GetCoursesSlice.actions;
export default GetCoursesSlice.reducer;
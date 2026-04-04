import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminDeleteUniversity, ApiBaseUrl } from "../../utils/constants";

export const hitAdminDeleteUniversity = createAsyncThunk(
  "hitAdminDeleteUniversity",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminDeleteUniversity;

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
      console.log("Response Delete University ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminDeleteUniversitySlice = createSlice({
  name: "adminDeleteUniversityReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminDeleteUniversity: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminDeleteUniversity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminDeleteUniversity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminDeleteUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAdminDeleteUniversity } = AdminDeleteUniversitySlice.actions;
export default AdminDeleteUniversitySlice.reducer;
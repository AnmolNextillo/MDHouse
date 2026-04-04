import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminAddUniversity, ApiBaseUrl } from "../../utils/constants";

export const hitAdminAddUniversity = createAsyncThunk(
  "hitAdminAddUniversity",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminAddUniversity;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.post(url, payload, config);

      console.log("Request Payload:", payload);
      console.log("Response Add University ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminAddUniversitySlice = createSlice({
  name: "adminAddUniversityReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminAddUniversity: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminAddUniversity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminAddUniversity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminAddUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAdminAddUniversity } = AdminAddUniversitySlice.actions;
export default AdminAddUniversitySlice.reducer;
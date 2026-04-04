import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminUpdateUniversity, ApiBaseUrl } from "../../utils/constants";

export const hitAdminUpdateUniversity = createAsyncThunk(
  "hitAdminUpdateUniversity",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminUpdateUniversity;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.put(url, payload, config);

      console.log("Request Payload:", payload);
      console.log("Response Update University ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminUpdateUniversitySlice = createSlice({
  name: "adminUpdateUniversityReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminUpdateUniversity: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminUpdateUniversity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminUpdateUniversity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminUpdateUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAdminUpdateUniversity } = AdminUpdateUniversitySlice.actions;
export default AdminUpdateUniversitySlice.reducer;
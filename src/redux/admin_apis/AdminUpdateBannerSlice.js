import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminUpdateBanner, ApiBaseUrl } from "../../utils/constants";

export const hitAdminUpdateBanner = createAsyncThunk(
  "hitAdminUpdateBanner",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminUpdateBanner;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.put(url, payload, config);

      console.log("Request Payload:", payload);
      console.log("Response Update Banner ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminUpdateBannerSlice = createSlice({
  name: "adminUpdateBannerReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminUpdateBanner: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminUpdateBanner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminUpdateBanner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminUpdateBanner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAdminUpdateBanner } = AdminUpdateBannerSlice.actions;
export default AdminUpdateBannerSlice.reducer;
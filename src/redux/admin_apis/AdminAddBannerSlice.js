import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminAddBanner, ApiBaseUrl } from "../../utils/constants";

export const hitAdminAddBanner = createAsyncThunk(
  "hitAdminAddBanner",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminAddBanner;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.post(url, payload, config);

      console.log("Request Payload:", payload);
      console.log("Response Add Banner ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminAddBannerSlice = createSlice({
  name: "adminAddBannerReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminAddBanner: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminAddBanner.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminAddBanner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminAddBanner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAdminAddBanner } = AdminAddBannerSlice.actions;
export default AdminAddBannerSlice.reducer;
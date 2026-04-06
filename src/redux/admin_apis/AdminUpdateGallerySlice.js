import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminUpdateGallery, ApiBaseUrl } from "../../utils/constants";

export const hitAdminUpdateGallery = createAsyncThunk(
  "hitAdminUpdateGallery",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminUpdateGallery;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.put(url, payload, config);

      console.log("Request Payload:", payload);
      console.log("Response Update Gallery ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminUpdateGallerySlice = createSlice({
  name: "adminUpdateGalleryReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminUpdateGallery: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminUpdateGallery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminUpdateGallery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminUpdateGallery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAdminUpdateGallery } = AdminUpdateGallerySlice.actions;
export default AdminUpdateGallerySlice.reducer;
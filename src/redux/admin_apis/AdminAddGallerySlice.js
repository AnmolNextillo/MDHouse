import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminAddGallery, ApiBaseUrl } from "../../utils/constants";

export const hitAdminAddGallery = createAsyncThunk(
  "hitAdminAddGallery",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminAddGallery;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.post(url, payload, config);

      console.log("Request Payload:", payload);
      console.log("Response Add Gallery ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminAddGallerySlice = createSlice({
  name: "adminAddGalleryReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminAddGallery: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminAddGallery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminAddGallery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminAddGallery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAdminAddGallery } = AdminAddGallerySlice.actions;
export default AdminAddGallerySlice.reducer;
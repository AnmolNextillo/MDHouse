import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminDeleteAnnouncement, ApiBaseUrl } from "../../utils/constants";

export const hitAdminDeleteAnnouncement = createAsyncThunk(
  "hitAdminDeleteAnnouncement",
  async ({ id }) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminDeleteAnnouncement;

      const payload = {
        id,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.delete(url, { data: payload, ...config });

      console.log("Request URL:", url);
      console.log("Request Payload:", payload);
      console.log("Response Delete Announcement ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminDeleteAnnouncementSlice = createSlice({
  name: "adminDeleteAnnouncementReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminDeleteAnnouncement: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminDeleteAnnouncement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminDeleteAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminDeleteAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAdminDeleteAnnouncement } = AdminDeleteAnnouncementSlice.actions;
export default AdminDeleteAnnouncementSlice.reducer;
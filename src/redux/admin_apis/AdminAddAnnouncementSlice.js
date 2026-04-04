import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminAddAnnouncement, ApiBaseUrl } from "../../utils/constants";

export const hitAdminAddAnnouncement = createAsyncThunk(
  "hitAdminAddAnnouncement",
  async ({ title, description }) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminAddAnnouncement;

      const payload = {
        title,
        description,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.post(url, payload, config);

      console.log("Request URL:", url);
      console.log("Request Payload:", payload);
      console.log("Response Add Announcement ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminAddAnnouncementSlice = createSlice({
  name: "adminAddAnnouncementReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminAddAnnouncement: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminAddAnnouncement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminAddAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminAddAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAdminAddAnnouncement } = AdminAddAnnouncementSlice.actions;
export default AdminAddAnnouncementSlice.reducer;
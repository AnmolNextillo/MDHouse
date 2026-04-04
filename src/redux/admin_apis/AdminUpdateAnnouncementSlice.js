import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminUpdateAnnouncement, ApiBaseUrl } from "../../utils/constants";

export const hitAdminUpdateAnnouncement = createAsyncThunk(
  "hitAdminUpdateAnnouncement",
  async ({ id, title, description }) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminUpdateAnnouncement;

      const payload = {
        id,
        title,
        description,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.put(url, payload, config);

      console.log("Request URL:", url);
      console.log("Request Payload:", payload);
      console.log("Response Update Announcement ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminUpdateAnnouncementSlice = createSlice({
  name: "adminUpdateAnnouncementReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAdminUpdateAnnouncement: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminUpdateAnnouncement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAdminUpdateAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminUpdateAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAdminUpdateAnnouncement } = AdminUpdateAnnouncementSlice.actions;
export default AdminUpdateAnnouncementSlice.reducer;
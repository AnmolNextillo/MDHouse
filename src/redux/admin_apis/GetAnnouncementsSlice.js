import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminAnnouncements, ApiBaseUrl } from "../../utils/constants";

export const hitGetAnnouncements = createAsyncThunk(
  "hitGetAnnouncements",
  async ({ start = 0, length = 10, search = "" } = {}) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminAnnouncements;

      const payload = {
        start,
        length,
        search,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.post(url, payload, config);

      console.log("Request URL:", `${url}?start=${start}&length=${length}&search=${search}`);
      console.log("Request Payload:", payload);
      console.log("Response Announcements ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const GetAnnouncementsSlice = createSlice({
  name: "getAnnouncementsReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetAnnouncements: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGetAnnouncements.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearGetAnnouncements } = GetAnnouncementsSlice.actions;
export default GetAnnouncementsSlice.reducer;
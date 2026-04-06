import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminGallery, ApiBaseUrl } from "../../utils/constants";

export const hitGetGallery = createAsyncThunk(
  "hitGetGallery",
  async ({ start = 0, length = 10, search = "" } = {}) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminGallery;

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
      console.log("Response Gallery ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const GetGallerySlice = createSlice({
  name: "getGalleryReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetGallery: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGetGallery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetGallery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetGallery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearGetGallery } = GetGallerySlice.actions;
export default GetGallerySlice.reducer;
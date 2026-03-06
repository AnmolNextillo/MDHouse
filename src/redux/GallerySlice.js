// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, getGallery, getResult, issueReports } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitGallery= createAsyncThunk("hitGallery", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + getGallery;
    console.log("URL ====> ",url,"  Payload ===>",payload, "Token ===> ",token)
    const response = await axios.get(url,config);
    console.log("Response Gallery===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const GallerySlice = createSlice({
  name: "galleryReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGallery: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGallery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGallery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGallery.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearGallery } = GallerySlice.actions;
export default GallerySlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSettings, ApiBaseUrl } from "../../utils/constants";

export const hitGetSettings = createAsyncThunk(
  "hitGetSettings",
  async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + getSettings;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.post(url, {}, config);

      console.log("Request URL:", url);
      console.log("Response Get Settings ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const GetSettingsSlice = createSlice({
  name: "getSettingsReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetSettings: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGetSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearGetSettings } = GetSettingsSlice.actions;
export default GetSettingsSlice.reducer;
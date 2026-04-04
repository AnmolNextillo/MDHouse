import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateSettings, ApiBaseUrl } from "../../utils/constants";

export const hitUpdateSettings = createAsyncThunk(
  "hitUpdateSettings",
  async ({ totalMedicalStudentGuided, totalPartnerUniversities, totalSuccessfulDoctors }) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + updateSettings;

      const payload = {
        totalMedicalStudentGuided: parseInt(totalMedicalStudentGuided),
        totalPartnerUniversities: parseInt(totalPartnerUniversities),
        totalSuccessfulDoctors: parseInt(totalSuccessfulDoctors),
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
      console.log("Response Update Settings ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const UpdateSettingsSlice = createSlice({
  name: "updateSettingsReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearUpdateSettings: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitUpdateSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitUpdateSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitUpdateSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearUpdateSettings } = UpdateSettingsSlice.actions;
export default UpdateSettingsSlice.reducer;
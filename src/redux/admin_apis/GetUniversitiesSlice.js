import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminUniversities, ApiBaseUrl } from "../../utils/constants";

export const hitGetUniversities = createAsyncThunk(
  "hitGetUniversities",
  async ({ start = 0, length = 10, search = "" } = {}) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminUniversities;

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
      console.log("Response Universities ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const GetUniversitiesSlice = createSlice({
  name: "getUniversitiesReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetUniversities: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGetUniversities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetUniversities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetUniversities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearGetUniversities } = GetUniversitiesSlice.actions;
export default GetUniversitiesSlice.reducer;
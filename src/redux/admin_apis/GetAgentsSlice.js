    // src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminAgents, ApiBaseUrl } from "../../utils/constants";

export const hitGetAgents = createAsyncThunk(
  "hitGetAgents",
  async ({ start = 0, length = 10, search = "" } = {}) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminAgents;

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
      console.log("Response Agents ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const GetAgentsSlice = createSlice({
  name: "getAgentsReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetAgents: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGetAgents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetAgents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetAgents.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearGetAgents } = GetAgentsSlice.actions;
export default GetAgentsSlice.reducer;
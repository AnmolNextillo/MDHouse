    // src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminAgentDetails, ApiBaseUrl } from "../../utils/constants";

export const hitGetAgentDetails = createAsyncThunk(
  "hitGetAgentDetails",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + adminAgentDetails;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };    

      const response = await axios.post(url, payload, config);

      console.log("Request Payload:", payload);
      console.log("Response Agents ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminAgentDetailSlice = createSlice({
  name: "getAgentDetailsReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetAgentDetails: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGetAgentDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetAgentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetAgentDetails.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearGetAgentDetails } = AdminAgentDetailSlice.actions;
export default AdminAgentDetailSlice.reducer;
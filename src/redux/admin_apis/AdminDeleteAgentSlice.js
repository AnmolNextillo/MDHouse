import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiBaseUrl, adminDeleteAgent } from "../../utils/constants";

export const hitAdminDeleteAgent = createAsyncThunk(
  "hitAdminDeleteAgent",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
      };
      const url = ApiBaseUrl + adminDeleteAgent;
      const response = await axios.put(url, payload, config);
      return response.data;
    } catch (error) {
      throw (error.response && error.response.data) || error;
    }
  }
);

const AdminDeleteAgentSlice = createSlice({
  name: "adminDeleteAgentReducer",
  initialState: {
    isLoading: false,
    data: null,
    error: null,
  },
  reducers: {
    clearAdminDeleteAgent: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminDeleteAgent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hitAdminDeleteAgent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminDeleteAgent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Delete failed";
      });
  },
});

export const { clearAdminDeleteAgent } = AdminDeleteAgentSlice.actions;
export default AdminDeleteAgentSlice.reducer;

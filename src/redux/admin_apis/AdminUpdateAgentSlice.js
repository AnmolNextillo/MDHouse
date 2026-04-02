import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiBaseUrl, adminUpdateAgent } from "../../utils/constants";

export const hitAdminUpdateAgent = createAsyncThunk(
  "hitAdminUpdateAgent",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
      };
      const url = ApiBaseUrl + adminUpdateAgent;
      console.log("Admin Update Agent URL =>", url, "payload =>", payload);
      const response = await axios.put(url, payload, config);
      return response.data;
    } catch (error) {
      throw (error.response && error.response.data) || error;
    }
  }
);

const AdminUpdateAgentSlice = createSlice({
  name: "adminUpdateAgentReducer",
  initialState: {
    isLoading: false,
    data: null,
    error: null,
  },
  reducers: {
    clearAdminUpdateAgent: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminUpdateAgent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hitAdminUpdateAgent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAdminUpdateAgent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Update failed";
      });
  },
});

export const { clearAdminUpdateAgent } = AdminUpdateAgentSlice.actions;
export default AdminUpdateAgentSlice.reducer;

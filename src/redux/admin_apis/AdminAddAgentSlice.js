import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiBaseUrl, adminAddAgent } from "../../utils/constants";

export const hitAdminAddAgent = createAsyncThunk(
  "hitAdminAddAgent",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
      };

      const url = ApiBaseUrl + adminAddAgent;
      console.log("Admin Add Agent URL =>", url, "payload =>", payload);
      const response = await axios.post(url, payload, config);
      console.log("Admin add agent response =>", response.data);
      return response.data;
    } catch (error) {
      console.error("Admin add agent error =>", error);
      throw (error.response && error.response.data) || error;
    }
  }
);

const AdminAddAgentSlice = createSlice({
  name: "adminAddAgentReducer",
  initialState: {
    isLoading: false,
    data: null,
    error: null,
  },
  reducers: {
    clearAdminAddAgent: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAdminAddAgent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(hitAdminAddAgent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(hitAdminAddAgent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error ? action.error.message : "Unknown error";
      });
  },
});

export const { clearAdminAddAgent } = AdminAddAgentSlice.actions;
export default AdminAddAgentSlice.reducer;

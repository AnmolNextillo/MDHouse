    // src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, getAgentList, getTelexRecord } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitAgentList = createAsyncThunk("hitAgentList", async (payload) => {
  try {
   const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + getAgentList;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.get(url,config);
    console.log("Response Agents===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const AgentListSlice = createSlice({
  name: "agentsReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearAgentList: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAgentList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAgentList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAgentList.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearAgentList } = AgentListSlice.actions;
export default AgentListSlice.reducer;
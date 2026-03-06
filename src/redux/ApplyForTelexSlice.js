    // src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, applyForTelex, getTelexRecord } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitApplyTelex = createAsyncThunk("hitApplyTelex", async (payload) => {
  try {
   const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + applyForTelex;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.post(url,payload,config);
    console.log("Response Telex Response===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const ApplyForTelexSlice = createSlice({
  name: "applyTelexReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearApplyTelex: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitApplyTelex.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitApplyTelex.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitApplyTelex.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearApplyTelex } = ApplyForTelexSlice.actions;
export default ApplyForTelexSlice.reducer;
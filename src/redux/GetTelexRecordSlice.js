    // src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, getTelexRecord } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitTelexRecord = createAsyncThunk("hitTelexRecord", async (payload) => {
  try {
   const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + getTelexRecord;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.get(url,config);
    console.log("Response Telex Record===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const GetTelexRecordSlice = createSlice({
  name: "telexRecordReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearTelexRecord: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitTelexRecord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitTelexRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitTelexRecord.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearTelexRecord } = GetTelexRecordSlice.actions;
export default GetTelexRecordSlice.reducer;
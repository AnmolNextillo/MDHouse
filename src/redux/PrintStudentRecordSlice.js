    // src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, getStudentDetails, getTelexRecord, printStudentRecord } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitPrintStudentRecord = createAsyncThunk("hitPrintStudentRecord", async (payload) => {
  try {
   const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + printStudentRecord + `?studentId=${payload.studentId}`;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.get(url,config);
    console.log("Response Print Student Record===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const PrintStudentRecordSlice = createSlice({
  name: "printStudentRecordReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearPrintStudentRecord: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitPrintStudentRecord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitPrintStudentRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitPrintStudentRecord.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearPrintStudentRecord } = PrintStudentRecordSlice.actions;
export default PrintStudentRecordSlice.reducer;
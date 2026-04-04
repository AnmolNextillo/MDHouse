import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiBaseUrl, adminAddStudentResult } from "../../utils/constants";

export const hitAddStudentResult = createAsyncThunk(
  "hitAddStudentResult",
  async ({ studentId, resultArray }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      };
      const payload = {
        studentId,
        resultArray,
      };
      const url = ApiBaseUrl + adminAddStudentResult;
      const response = await axios.post(url, payload, config);
      console.log("Response addStudentResult ===>", response.data);
      return response.data;
    } catch (error) {
      console.log("Error addStudentResult ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AddStudentResultSlice = createSlice({
  name: "adminAddStudentResultReducer",
  initialState: {
    isLoading: false,
    data: null,
    error: null,
  },
  reducers: {
    clearAddStudentResult: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitAddStudentResult.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitAddStudentResult.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitAddStudentResult.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Unable to submit student result";
      });
  },
});

export const { clearAddStudentResult } = AddStudentResultSlice.actions;
export default AddStudentResultSlice.reducer;

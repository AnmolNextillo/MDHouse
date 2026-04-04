import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiBaseUrl, adminGetStudentResult } from "../../utils/constants";

export const hitGetStudentResult = createAsyncThunk(
  "hitGetStudentResult",
  async ({ studentId }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      };
      const payload = { studentId };
      const url = ApiBaseUrl + adminGetStudentResult;
      const response = await axios.post(url, payload, config);
      console.log("Response Get Student Result ===>", response.data);
      return response.data;
    } catch (error) {
      console.log("Error Get Student Result ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const StudentResultSlice = createSlice({
  name: "adminGetStudentResultReducer",
  initialState: {
    isLoading: false,
    data: null,
    error: null,
  },
  reducers: {
    clearGetStudentResult: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGetStudentResult.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetStudentResult.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetStudentResult.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Unable to fetch student result";
      });
  },
});

export const { clearGetStudentResult } = StudentResultSlice.actions;
export default StudentResultSlice.reducer;

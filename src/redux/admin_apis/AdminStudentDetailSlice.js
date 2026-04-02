import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStudents, ApiBaseUrl } from "../../utils/constants";

export const hitGetStudentDetails = createAsyncThunk(
  "hitGetStudentDetails",
  async (payload) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + getStudents + `?studentId=${payload.studentId}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };

      const response = await axios.get(url, config);

      console.log("Request URL:", url);
      console.log("Response Student Details ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const AdminStudentDetailSlice = createSlice({
  name: "getStudentDetailsReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetStudentDetails: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGetStudentDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetStudentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetStudentDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearGetStudentDetails } = AdminStudentDetailSlice.actions;
export default AdminStudentDetailSlice.reducer;
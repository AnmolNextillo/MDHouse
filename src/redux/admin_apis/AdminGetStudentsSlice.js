import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStudents, ApiBaseUrl } from "../../utils/constants";

export const hitGetStudents = createAsyncThunk(
  "hitGetStudents",
  async ({ start = 0, length = 10, search = "", type= "" } = {}) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const url = ApiBaseUrl + getStudents;

      const payload = {
        start,
        length,
        search,
        type
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        }
      };    

      const response = await axios.post(url, payload, config);

      console.log("Request URL:", `${url}?start=${start}&length=${length}&search=${search}`);
      console.log("Request Payload:", payload);
      console.log("Response Students ===>", response.data);

      return response.data;
    } catch (error) {
      console.log("Error ===>", error);
      throw error?.response?.data || error;
    }
  }
);

const GetStudentsSlice = createSlice({
  name: "getStudentsReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetStudents: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGetStudents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetStudents.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearGetStudents } = GetStudentsSlice.actions;
export default GetStudentsSlice.reducer;

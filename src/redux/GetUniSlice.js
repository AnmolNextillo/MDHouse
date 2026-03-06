    // src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, getUniversityList } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitGetUni = createAsyncThunk("hitGetUni", async (payload) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const url = ApiBaseUrl + getUniversityList;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.get(url);
    console.log("Response Get Uni===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const GetUniSlice = createSlice({
  name: "getUniReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearGetUni: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitGetUni.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitGetUni.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitGetUni.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearGetUni } = GetUniSlice.actions;
export default GetUniSlice.reducer;
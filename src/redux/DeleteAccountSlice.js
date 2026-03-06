// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ApiBaseUrl, deleteAccount } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hitDeleteAccount = createAsyncThunk("hitDeleteAccount", async (payload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization:token
      },
    };
    const url = ApiBaseUrl + deleteAccount;
    console.log("URL ====> ",url,"  Payload ===>",payload)
    const response = await axios.delete(url,config);
    console.log("Response Delete Profile===> ",response.data);
    return response.data;
  } catch (error) {
    console.log("Error ===> ",error)
    throw error.response.data;
  }
});

const DeleteAccountSlice = createSlice({
  name: "deleteAccountReducer",

  initialState: {
    isLoading: false,
    data: null,
  },
  reducers: {
    clearDeleteAccount: (state) => {
      state.data = null;
    },  
  },
  extraReducers: (builder) => {
    builder
      .addCase(hitDeleteAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hitDeleteAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(hitDeleteAccount.rejected, (state) => {
        state.isError = false;
      });
  },
});

export const { clearDeleteAccount } = DeleteAccountSlice.actions;
export default DeleteAccountSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching data
export const uploadFile = createAsyncThunk('uploadFile', async (image) => {

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "multipart/form-data",
    }


    console.log("Image ===> ",image )

    const formData = new FormData();
    formData.append('myfile',  {
        uri: image.uri,
        name: image.fileName,
        type: image.type,
      });
    console.log("FormData ===> ",formData)

    try {
        const url = "https://api-mdhouse.erptech.info/v1/upload"
        const response = await axios.post(url, formData, { headers });
        console.log("Upload file Response ===>",response.data)
        return response.data;
    } catch (error) {
        console.log("Upload Image Error ===> ", error.message)
        throw error;
    }
});

const FileUploadSlice = createSlice({
    name: 'uploadFileReducer',
    initialState: {
        data: null,
        loading: 'idle',
        error: null,
    },
    reducers: {
        clearUploadFileData: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (state) => {
                state.loading = 'pending';
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.loading = 'idle';
                state.data = action.payload;
                state.error = null;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                console.log("Upload Image Error ===> ", action.payload)
                state.loading = 'idle';
                state.error = action.error.message;
            });
    },
});

export const { clearUploadFileData } = FileUploadSlice.actions;
export default FileUploadSlice.reducer;
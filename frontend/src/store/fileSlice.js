import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSharedFilesApi, fetchFilesApi, uploadFileApi, shareFileApi } from "../services/api";

export const fetchFiles = createAsyncThunk(
  "files/fetchFiles",
  async (token, thunkAPI) => {
    try {
      const response = await fetchFilesApi(token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchSharedFiles = createAsyncThunk(
    "files/fetchSharedFiles",
    async (token, thunkAPI) => {
      try {
        const response = await fetchSharedFilesApi(token);
        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
  );

export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async ({ formData, token }, thunkAPI) => {
    try {
      const response = await uploadFileApi(formData, token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const shareFile = createAsyncThunk(
  "files/shareFile",
  async ({ fileId, sharedWith, permission, expiryDays, token }, thunkAPI) => {
    try {
      const shareData = {
        file: fileId,
        shared_with: sharedWith,
        permission,
        expiry_days: expiryDays,
      };
      const response = await shareFileApi(shareData, token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
const fileSlice = createSlice({
  name: "files",
  initialState: {
    files: [],
    sharedFiles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.files = [action.payload, ...state.files];
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(shareFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shareFile.fulfilled, (state, action) => {
        state.loading = false;
        //TODO: Handle share file success and show message in ui.
      })
      .addCase(shareFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSharedFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSharedFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.sharedFiles = action.payload;
      })
      .addCase(fetchSharedFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default fileSlice.reducer;

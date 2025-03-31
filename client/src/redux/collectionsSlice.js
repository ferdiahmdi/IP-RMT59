import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../helpers/http";

export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await baseURL.get(`/collections/${userId}`, {
        headers: { authorization: localStorage.getItem("authorization") }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const collectionsSlice = createSlice({
  name: "collections",
  initialState: {
    data: [],
    status: "idle",
    error: null
  },
  reducers: {
    addCollection: (state, action) => {
      state.data.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { addCollection } = collectionsSlice.actions;
export default collectionsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../helpers/http";

export const fetchEntries = createAsyncThunk(
  "entries/fetchEntries",
  async ({ userId, collectionId }, { rejectWithValue }) => {
    try {
      const response = await baseURL.get(
        `/collections/${userId}/${collectionId}`,
        {
          headers: { authorization: localStorage.getItem("authorization") }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const entriesSlice = createSlice({
  name: "entries",
  initialState: {
    data: [],
    status: "idle",
    error: null
  },
  reducers: {
    clearEntries: (state) => {
      state.data = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { clearEntries } = entriesSlice.actions;
export default entriesSlice.reducer;

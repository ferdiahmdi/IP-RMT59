import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../helpers/http";

export const fetchAnimes = createAsyncThunk(
  "animes/fetchAnimes",
  async (query, { rejectWithValue }) => {
    try {
      const response = await baseURL.get("/animes", {
        headers: { authorization: localStorage.getItem("authorization") },
        params: { q: query }
      });

      const data = response.data;

      console.log(data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const animeSlice = createSlice({
  name: "animes",
  initialState: {
    data: [],
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnimes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchAnimes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export default animeSlice.reducer;

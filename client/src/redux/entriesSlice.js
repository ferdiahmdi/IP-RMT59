import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../helpers/http";

const entriesSlice = createSlice({
  name: "entries",
  initialState: {
    data: [],
    recommendations: [],
    recommendationsLoading: false
  },
  reducers: {
    setEntries: (state, action) => {
      state.data = action.payload;
    },
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },
    setLoadRecommendations: (state, action) => {
      state.recommendationsLoading = action.payload;
    }
  }
});

export const { setEntries, setRecommendations, setLoadRecommendations } =
  entriesSlice.actions;
export const entriesReducer = entriesSlice.reducer;

export const fetchEntries = createAsyncThunk(
  "entries/fetchEntries",
  async (collectionId, { dispatch }) => {
    try {
      const response = await baseURL.get(`/collections/${collectionId}`, {
        headers: { authorization: localStorage.getItem("authorization") }
      });
      // console.log(response.data);

      dispatch(setEntries(response.data));
    } catch (error) {
      console.error(error);
    }
  }
);

export const fetchRecommendations = createAsyncThunk(
  "entries/fetchRecommendations",
  async (collectionId, { dispatch, getState }) => {
    try {
      dispatch(setLoadRecommendations(true));
      const entries = getState().entries.data;

      if (entries.length === 0) {
        setRecommendations([]); // Reset recommendations if no entries
        throw new Error("No entries found in the collection");
      }

      const res = await baseURL.get(
        `/collections/${collectionId}/recommendations`,
        {
          headers: {
            authorization: localStorage.getItem("authorization")
          }
        }
      );
      const data = res.data;
      // console.log(data);

      dispatch(setRecommendations(data.result));
    } catch (error) {
      console.error(error, "Fetching recommendations failed");
      setRecommendations([]); // Reset recommendations on error
    } finally {
      dispatch(setLoadRecommendations(false));
    }
  }
);

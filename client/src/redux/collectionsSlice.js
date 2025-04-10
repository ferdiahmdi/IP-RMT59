import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import baseURL from "../helpers/http";

const collectionsSlice = createSlice({
  name: "collections",
  initialState: {
    data: []
  },
  reducers: {
    setCollections: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async (_, { dispatch }) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await baseURL.get(`/collections/${userId}`, {
        headers: { authorization: localStorage.getItem("authorization") }
      });
      // console.log(response.data);
      dispatch(setCollections(response.data));
    } catch (error) {
      console.error(error);
    }
  }
);

export const { setCollections } = collectionsSlice.actions;
export const collectionsReducer = collectionsSlice.reducer;

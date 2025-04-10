import { configureStore } from "@reduxjs/toolkit";
import { animeReducer } from "./animeSlice";
import { collectionsReducer } from "./collectionsSlice";
import { entriesReducer } from "./entriesSlice";

const store = configureStore({
  reducer: {
    anime: animeReducer,
    collections: collectionsReducer,
    entries: entriesReducer
  }
});

export default store;

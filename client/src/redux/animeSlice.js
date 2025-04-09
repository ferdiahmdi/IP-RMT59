import { createSlice } from "@reduxjs/toolkit";
import baseURL from "../helpers/http";

export const animeSlice = createSlice({
  name: "anime",
  initialState: {
    animes: [],
    loading: false
  },
  reducers: {
    setAnimes: (state, action) => {
      state.animes = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setAnimes, setLoading } = animeSlice.actions;
export const animeReducer = animeSlice.reducer;

export const getAnimes = (searchQuery) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await baseURL.get("/animes", {
        headers: {
          authorization: localStorage.getItem("authorization")
        },
        params: {
          q: searchQuery.get("q")
        }
      });
      const data = res.data;
      // console.log(data);

      const uniqueTitles = new Set(); // Define the Set outside the filter function

      const entries = !searchQuery.get("q")
        ? data.data
            .flatMap((item) => item.entry)
            .filter((entry) => {
              if (uniqueTitles.has(entry.title)) {
                return false; // Skip if the title already exists in the Set
              }
              uniqueTitles.add(entry.title); // Add the title to the Set
              return true; // Include the entry in the filtered array
            })
        : data.data.map((entry) => {
            return entry;
          });

      // setAnimes(entries);
      dispatch(setAnimes(entries));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const getMangas = (searchQuery) => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await baseURL.get("/mangas", {
        headers: {
          authorization: localStorage.getItem("authorization")
        },
        params: {
          q: searchQuery.get("q")
        }
      });
      const data = res.data;
      // console.log(data);

      const uniqueTitles = new Set(); // Define the Set outside the filter function

      const entries = !searchQuery.get("q")
        ? data.data
            .flatMap((item) => item.entry)
            .filter((entry) => {
              if (uniqueTitles.has(entry.title)) {
                return false; // Skip if the title already exists in the Set
              }
              uniqueTitles.add(entry.title); // Add the title to the Set
              return true; // Include the entry in the filtered array
            })
        : data.data.map((entry) => {
            return entry;
          });

      // setAnimes(entries);
      dispatch(setAnimes(entries));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
};

import { useEffect, useState } from "react";
import baseURL from "../helpers/http";
import AnimeCard from "../components/AnimeCard";

const Home = () => {
  const [animes, setAnimes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  const getAnimes = async (search) => {
    try {
      const res = await baseURL.get("/animes", {
        headers: {
          authorization: localStorage.getItem("authorization")
        },
        params: {
          q: search
        }
      });
      const data = res.data;
      console.log(data);

      const uniqueTitles = new Set(); // Define the Set outside the filter function

      const entries = !search
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

      setAnimes(entries);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAnimes();
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Search submitted:", searchQuery);
    getAnimes(searchQuery);
  };

  // console.log(animes);

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <h1 className="text-3xl font-bold mb-6 text-center">Recommendations</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="form-control mb-6 w-full">
        <div className="input-group flex justify-between items-center gap-2">
          <input
            type="text"
            placeholder="Search anime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-neutral">
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {animes.map((anime, index) => (
          <AnimeCard key={index} anime={anime} />
        ))}
      </div>
    </div>
  );
};

export default Home;

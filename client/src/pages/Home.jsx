import { useEffect, useState } from "react";
import baseURL from "../helpers/http";
import { Link } from "react-router";
import AnimeCard from "../components/AnimeCard";

const Home = () => {
  const [animes, setAnimes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  const getAnimes = async (search) => {
    try {
      const res = await baseURL.get("/animes", {
        headers: {
          authorization: localStorage.getItem("authorization")
        }
      });
      const data = res.data;

      const uniqueTitles = new Set(); // Define the Set outside the filter function

      const entries = data.data
        .flatMap((item) => item.entry)
        .filter((entry) => {
          if (uniqueTitles.has(entry.title)) {
            return false; // Skip if the title already exists in the Set
          }
          uniqueTitles.add(entry.title); // Add the title to the Set
          return true; // Include the entry in the filtered array
        });

      // console.log(res.data);
      setAnimes(entries);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAnimes();
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    console.log("Search submitted:", searchQuery); // Replace with your handler function
    // Call your search handler here with `searchQuery`
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

      {/* Anime Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {animes.map((anime, index) => (
          <AnimeCard key={index} anime={anime} />
        ))}
      </div>
    </div>
  );
};

export default Home;

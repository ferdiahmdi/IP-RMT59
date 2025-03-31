import { useEffect, useRef, useState } from "react";
import baseURL from "../helpers/http";
import AnimeCard from "../components/AnimeCard";
import EntryForm from "../components/EntryForm";

const Home = () => {
  const [animes, setAnimes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query

  const [loading, setLoading] = useState(false);

  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [type, setType] = useState("anime");
  const [successToast, setSuccessToast] = useState(false);
  const ref = useRef(null);

  const getAnimes = async (search) => {
    try {
      setLoading(true);
      const res = await baseURL.get("/animes", {
        headers: {
          authorization: localStorage.getItem("authorization")
        },
        params: {
          q: search
        }
      });
      const data = res.data;
      // console.log(data);

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
    } finally {
      setLoading(false);
    }
  };

  const getMangas = async (search) => {
    try {
      setLoading(true);
      const res = await baseURL.get("/mangas", {
        headers: {
          authorization: localStorage.getItem("authorization")
        },
        params: {
          q: search
        }
      });
      const data = res.data;
      // console.log(data);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type === "anime") {
      getAnimes();
    } else {
      getMangas();
    }
  }, [type]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (type === "anime") getAnimes(searchQuery);
    else getMangas(searchQuery);
  };

  // console.log(animes);
  const openModal = (mal_id) => {
    setSelectedId(mal_id);
    ref.current.showModal();
  };

  const closeModal = (add) => {
    ref.current.close();
    if (add === "add") setSuccessToast(true);
  };

  return (
    <div className="min-h-screen p-6 bg-base-200 flex flex-col justify-start items-center">
      <EntryForm
        ref={ref}
        handleClose={closeModal}
        malId={selectedId}
        type={type}
        title={selectedTitle}
      />

      {successToast && (
        <div className="toast toast-start toast-top top-15 z-50">
          <div className="alert alert-success">
            <span>Successfully added entry!</span>
            <button
              onClick={() => setSuccessToast(false)}
              className="btn btn-xs btn-circle btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-center">Recommendations</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="form-control mb-6 w-full">
        <div className="input-group flex justify-between items-center gap-2">
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-neutral">
            Search
          </button>
        </div>
      </form>

      {/* Button to switch types between anime and manga */}
      <div className="flex justify-center gap-4 w-full mb-6">
        <button
          className={`btn ${type === "anime" ? "btn-active" : ""}`}
          onClick={() => setType("anime")}
        >
          Anime
        </button>
        <button
          className={`btn ${type === "manga" ? "btn-active" : ""}`}
          onClick={() => setType("manga")}
        >
          Manga
        </button>
      </div>

      {loading ? (
        <span className="loading loading-dots loading-xl" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {animes.map((anime, index) => (
            <AnimeCard
              key={index}
              anime={anime}
              handleClick={() => {
                setSelectedTitle(anime.title);
                openModal(anime.mal_id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

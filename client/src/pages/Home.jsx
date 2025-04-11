import { useEffect, useRef, useState } from "react";
import AnimeCard from "../components/AnimeCard";
import EntryForm from "../components/EntryForm";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getAnimes, getMangas } from "../redux/animeSlice";

const Home = () => {
  const params = useParams();
  const { type } = params; // Get the type from the URL parameters
  const [searchQuery] = useSearchParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState(""); // State for the search query
  // const [animes, setAnimes] = useState([]);
  const animes = useSelector((state) => state.anime.animes);
  const loading = useSelector((state) => state.anime.loading);
  const dispatch = useDispatch();

  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [successToast, setSuccessToast] = useState(false);
  const ref = useRef(null);

  // const getAnimes = useCallback(, [searchQuery, dispatch]);

  // const getMangas = useCallback(, [searchQuery, dispatch]);

  useEffect(() => {
    if (!localStorage.getItem("authorization")) {
      console.error("No authorization token found");
      navigate("/login");
    }

    setSearch(searchQuery.get("q") || ""); // Set the search state from the URL query
    if (type === "anime") {
      dispatch(getAnimes(searchQuery));
    } else {
      dispatch(getMangas(searchQuery));
    }
  }, [type, searchQuery, dispatch]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`?q=${search}`); // Update the URL with the search query
    // if (type === "anime") getAnimes(searchQuery);
    // else getMangas(searchQuery);
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

  // console.log(animes);

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
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Update search query state
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
          onClick={() => navigate("/home/anime")}
        >
          Anime
        </button>
        <button
          className={`btn ${type === "manga" ? "btn-active" : ""}`}
          onClick={() => navigate("/home/manga")}
        >
          Manga
        </button>
      </div>

      {loading ? (
        <span className="loading loading-dots loading-xl" />
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
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

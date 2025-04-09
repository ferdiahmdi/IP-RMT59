import { useCallback, useEffect, useState, useRef } from "react";
import baseURL from "../helpers/http";
import CollectionCard from "../components/CollectionCard";
import AddCollection from "../components/AddCollection";
import Entries from "../components/Entries";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState("");

  // const { collectionId, userId } = useParams();
  const [collectionId, setCollectionId] = useState(null);
  const [entries, setEntries] = useState([]);
  const [recommendations, setRecommendations] = useState([]); // State to hold the recommendations

  const ref = useRef(null);
  const ref2 = useRef(null);

  const userId = localStorage.getItem("userId");

  // Fetch collections for the user
  const fetchCollections = useCallback(async () => {
    try {
      const res = await baseURL.get(`/collections/${userId}`, {
        headers: {
          authorization: localStorage.getItem("authorization")
        }
      });

      const data = res.data;
      // console.log(data);

      setCollections(data);
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  // Create a new collection
  const createCollection = async (e) => {
    e.preventDefault();
    try {
      const res = await baseURL.post(
        "/collections",
        { name: newCollectionName, userId },
        {
          headers: {
            authorization: localStorage.getItem("authorization")
          }
        }
      );

      console.log(res.data);

      setNewCollectionName(""); // Clear the input field
      ref.current.close();

      fetchCollections();
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch entries for the selected collection
  const fetchEntries = useCallback(async () => {
    try {
      const res = await baseURL.get(`/collections/${userId}/${collectionId} `, {
        headers: {
          authorization: localStorage.getItem("authorization")
        }
      });

      const data = res.data;
      // console.log(data);

      setEntries(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }, [collectionId, userId]);

  // Function to fetch the recommendation
  const [loadRecommendations, setLoadRecommendations] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoadRecommendations(true);
      if (entries.length === 0) {
        setRecommendations([]); // Reset recommendations if no entries
        throw new Error("No entries found in the collection");
      }

      const res = await baseURL.get(
        `/collections/${userId}/${collectionId}/recommendations`,
        {
          headers: {
            authorization: localStorage.getItem("authorization")
          }
        }
      );
      const data = res.data;
      // console.log(data);

      setRecommendations(data.result); // Set the recommendations
    } catch (error) {
      console.error(error, "Fetching recommendations failed");
      setRecommendations([]); // Reset recommendations on error
    } finally {
      setLoadRecommendations(false);
    }
  }, [collectionId, userId, entries]);

  const handleEdit = async ({ id, progress, completed, collectionId }) => {
    try {
      const res = await baseURL.put(
        `/entries/${collectionId}/${id}`,
        {
          progress,
          completed
        },
        {
          headers: {
            authorization: localStorage.getItem("authorization")
          }
        }
      );
      const data = res.data;
      console.log(data);

      fetchEntries();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await baseURL.delete(`/entries/${collectionId}/${id}`, {
        headers: {
          authorization: localStorage.getItem("authorization")
        }
      });
      const data = res.data;
      console.log(data);

      fetchEntries();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCollections();
    if (collectionId) {
      fetchEntries();
    }
  }, [fetchCollections, fetchEntries, collectionId]);

  const openModal = (ref, id) => {
    setCollectionId(id);
    fetchEntries().then(() => {
      ref.current.showModal();
      // console.log(fetched, "entries");
    });
  };

  const closeModal = (ref) => {
    ref.current.close();
  };

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <AddCollection
        onSubmit={createCollection}
        ref={ref}
        handleClose={() => closeModal(ref)}
        setName={setNewCollectionName}
      />
      <Entries
        ref={ref2}
        handleClose={() => closeModal(ref2)}
        entries={entries}
        collection={collections.find((element) => element.id === collectionId)}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        recommendations={recommendations}
        fetchRecommendations={fetchRecommendations}
        loadRecommendations={loadRecommendations}
      />

      <h1 className="text-3xl font-bold mb-6 text-center">My Collections</h1>

      <button onClick={() => openModal(ref)} className="btn btn-neutral">
        Create New Collection
      </button>

      {collections.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-2">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              handleClick={() => openModal(ref2, collection.id)}
            />
          ))}
        </div>
      ) : (
        <h2 className="w-full text-center font-xl font-semibold mt-2">
          Your Collection is Currently Empty
        </h2>
      )}
    </div>
  );
};

export default Collections;

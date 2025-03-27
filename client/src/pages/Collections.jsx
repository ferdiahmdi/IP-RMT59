import { useCallback, useEffect, useState, useRef } from "react";
import baseURL from "../helpers/http";
import CollectionCard from "../components/CollectionCard";
import AddCollection from "../components/AddCollection";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const ref = useRef(null);

  const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage

  // Fetch collections for the user
  const fetchCollections = useCallback(async () => {
    try {
      const res = await baseURL.get(`/collections/${userId}`, {
        headers: {
          authorization: localStorage.getItem("authorization")
        }
      });

      const data = res.data;
      console.log(data);

      setCollections(res.data);
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

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const openModal = () => {
    ref.current.showModal();
  };

  const closeModal = () => {
    ref.current.close();
  };

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <AddCollection
        onSubmit={createCollection}
        ref={ref}
        handleClose={closeModal}
        setName={setNewCollectionName}
      />

      <h1 className="text-3xl font-bold mb-6 text-center">My Collections</h1>

      <button onClick={openModal} className="btn btn-neutral">
        Create New Collection
      </button>

      {collections.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-2">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
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

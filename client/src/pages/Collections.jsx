import { useEffect, useState, useRef } from "react";
import baseURL from "../helpers/http";
import CollectionCard from "../components/CollectionCard";
import AddCollection from "../components/AddCollection";
import Entries from "../components/Entries";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollections } from "../redux/collectionsSlice";
import {
  fetchEntries,
  fetchRecommendations,
  setRecommendations
} from "../redux/entriesSlice";

const Collections = () => {
  const dispatch = useDispatch();
  const collections = useSelector((state) => state.collections.data);
  const [newCollectionName, setNewCollectionName] = useState("");

  const [collectionId, setCollectionId] = useState(null);
  const entries = useSelector((state) => state.entries.data);
  const recommendations = useSelector((state) => state.entries.recommendations);
  const loadRecommendations = useSelector(
    (state) => state.entries.recommendationsLoading
  );
  const [loadCoverImageUpload, setLoadCoverImageUpload] = useState({
    value: false,
    id: null
  });

  const ref = useRef(null);
  const ref2 = useRef(null);

  const userId = localStorage.getItem("userId");

  // Create a new collection
  const createCollection = async (event) => {
    event.preventDefault();
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

      console.log("Created Collection:", res.data);

      setNewCollectionName(""); // Clear the input field
      ref.current.close();

      dispatch(fetchCollections());
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch entries for the selected collection
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

      dispatch(fetchEntries(collectionId));
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

      dispatch(fetchEntries(collectionId));
    } catch (error) {
      console.error(error);
    }
  };

  const handlePatchCoverImage = async (event, id) => {
    try {
      event.preventDefault();
      setLoadCoverImageUpload(true);

      const formData = new FormData(event.target);
      // console.log(formData.get("coverImage"));

      const res = await baseURL.patch(`/collections/${id}/cover`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: localStorage.getItem("authorization")
        }
      });
      console.log("Updated cover image", res.data.message);

      dispatch(fetchCollections());
    } catch (error) {
      console.error(error);
    } finally {
      setLoadCoverImageUpload(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCollections());
    if (collectionId) {
      fetchEntries(collectionId);
    }
  }, [dispatch, collectionId]);

  const openModal = (ref, id) => {
    setCollectionId(id);
    dispatch(fetchEntries(id)).then(() => {
      ref.current.showModal();
      // console.log(fetched, "entries");
    });
  };

  const closeModal = (ref) => {
    dispatch(setRecommendations([]));
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
        fetchRecommendations={() =>
          dispatch(fetchRecommendations(collectionId))
        }
        loadRecommendations={loadRecommendations}
        handlePatchCoverImage={handlePatchCoverImage}
      />

      <h1 className="text-3xl font-bold mb-6 text-center">My Collections</h1>

      <button onClick={() => openModal(ref)} className="btn btn-neutral">
        Create New Collection
      </button>

      {collections.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              handleClick={() => openModal(ref2, collection.id)}
              loadCoverImageUpload={loadCoverImageUpload}
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

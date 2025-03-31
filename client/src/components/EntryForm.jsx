import { useCallback, useEffect, useState } from "react";
import baseURL from "../helpers/http";

const EntryForm = ({ ref, handleClose, type, title, malId, entry }) => {
  const [collectionNames, setCollectionNames] = useState([]);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [collectionId, setCollectionId] = useState(null);

  const userId = localStorage.getItem("userId");

  // if (entry) console.log(entry);

  const getCollections = useCallback(async () => {
    try {
      const res = await baseURL.get(`/collections/${userId}`, {
        headers: {
          authorization: localStorage.getItem("authorization")
        }
      });
      const data = res.data;
      // console.log(data);

      setCollectionId(data[0].id);
      setCollectionNames(data);
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  useEffect(() => {
    getCollections();
  }, [getCollections]);

  // console.log(collectionNames);

  return (
    <dialog ref={ref} className="modal">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            // console.log({
            //   type,
            //   progress,
            //   completed,
            //   collectionId,
            //   jikanId: malId
            // });
            const res = await baseURL.post(
              "/entries",
              {
                type,
                progress,
                completed,
                collectionId,
                jikanId: malId
              },
              {
                headers: {
                  authorization: localStorage.getItem("authorization")
                }
              }
            );
            const data = res.data;
            console.log(data);
            handleClose("add");
          } catch (error) {
            console.error(error);
          }
        }}
        className="modal-box form-control"
      >
        <h3 className="font-bold text-lg mb-1">
          {entry ? entry.title : title}
        </h3>
        <p className="font-semibold text-xs mb-1 text-accent">
          {type === "anime" ? `Anime` : `Manga`}
        </p>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Progress</legend>
          <input
            type="number"
            placeholder="Progress"
            className="input input-bordered mb-4"
            min={0}
            value={entry ? entry.progress : progress}
            onChange={(event) => setProgress(event.target.value)}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Completed</legend>
          <select
            className="select mb-4"
            onChange={(event) => setCompleted(event.target.value)}
            value={entry ? entry.completed : false}
          >
            <option value={false}>In Progress</option>
            <option value={true}>Completed</option>
          </select>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Collection</legend>
          <select
            className="select mb-4"
            onChange={(event) => setCollectionId(+event.target.value)}
            value={entry ? entry.collectionId : collectionId}
            disabled={entry ? true : false}
          >
            {collectionNames.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </fieldset>
        <div className="modal-action">
          <button type="submit" className="btn btn-primary">
            Add to Collection
          </button>
          <button type="button" onClick={handleClose} className="btn">
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default EntryForm;

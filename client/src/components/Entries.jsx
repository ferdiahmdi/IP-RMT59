import { useRef, useState, useEffect } from "react";
import EntryForm from "./EntryForm";
import { Link } from "react-router";

const Entries = ({
  ref,
  handleClose,
  entries,
  collection,
  handleEdit,
  handleDelete,
  recommendations,
  fetchRecommendations,
  loadRecommendations
}) => {
  const [editEntry, setEditEntry] = useState(null); // State to hold the entry being edited
  const [showRecommendation, setShowRecommendation] = useState(false); // State to control the recommendation modal
  const editRef = useRef(null); // Ref for the edit modal

  // console.log(entries);
  // console.log(recommendations);

  const handleRecommendation = () => {
    fetchRecommendations(); // Fetch recommendations from the server
    setShowRecommendation(!showRecommendation); // Show the recommendations
  };

  const handleEditModal = (entry) => {
    setEditEntry(entry); // Set the entry to be edited
    editRef.current.showModal(); // Open the AddEntry modal
  };

  const handleEditModalClose = () => {
    editRef.current.close(); // Close the AddEntry modal
  };

  useEffect(() => {
    // console.log(loadRecommendations);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose(); // Trigger handleClose when Esc is pressed
        setShowRecommendation(false); // Close the recommendation modal
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown); // Cleanup the event listener
    };
  }, [handleClose, loadRecommendations]);

  if (!collection) {
    return null; // Return null if collection is not available
  }

  return (
    <>
      {/* Edit Modal */}
      <EntryForm
        ref={editRef}
        handleClose={handleEditModalClose} // Switch back to Entries modal
        handleEdit={handleEdit}
        entry={editEntry} // Pass the entry to be edited
      />

      {/* Entries Modal */}
      <dialog ref={ref} className="modal">
        <div className="modal-box max-h-1/2 overflow-y-auto">
          <ul className="list bg-base-100 rounded-box shadow-md">
            {/* Always show the collection name */}
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
              {showRecommendation
                ? `Recommendations for ${collection.name}`
                : collection.name}
            </li>

            {/* Render entries only if the array is not empty */}
            {showRecommendation ? (
              loadRecommendations ? (
                <div className="flex justify-center items-center p-8">
                  <span className="loading loading-spinner loading-xl" />
                </div>
              ) : recommendations.length === 0 ? (
                <li className="p-4 text-sm text-gray-500">
                  No recommendations available.
                </li>
              ) : (
                recommendations.map((recommendation, index) => (
                  <li key={index} className="list-row">
                    <div></div>
                    <div>
                      <div>{recommendation.title}</div>
                      <div className="text-xs uppercase font-semibold opacity-60">
                        {`${recommendation.type}`}
                      </div>
                    </div>
                    <Link
                      to={`/home/${recommendation.type}?q=${recommendation.title}`}
                      className="btn btn-square btn-ghost"
                    >
                      {/* Edit Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 10.5 18a7.5 7.5 0 0 0 6.15-3.35z"
                        />
                      </svg>
                    </Link>
                  </li>
                ))
              )
            ) : entries.length > 0 ? (
              entries.map((entry) => (
                <li key={entry.id} className="list-row">
                  <div></div>
                  <div>
                    <div>{entry.title}</div>
                    <div className="text-xs uppercase font-semibold opacity-60">
                      {`${entry.type} - ${
                        entry.completed
                          ? "Completed"
                          : `In Progress - ${entry.progress}`
                      }`}
                    </div>
                  </div>
                  <button
                    className="btn btn-square btn-ghost"
                    onClick={() => handleEditModal(entry)}
                  >
                    {/* Edit Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.313l-4.5 1 1-4.5 12.862-12.326z"
                      />
                    </svg>
                  </button>
                  <button
                    className="btn btn-square btn-ghost"
                    onClick={() => handleDelete(entry.id)}
                  >
                    {/* Delete Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>
              ))
            ) : (
              // Optional: Show a message if there are no entries
              <li className="p-4 text-sm text-gray-500">
                No entries available.
              </li>
            )}
          </ul>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRecommendation}
            >
              {showRecommendation ? "Back" : "Recommendations"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowRecommendation(false);
                handleClose();
              }}
              className="btn"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Entries;

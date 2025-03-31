import { useRef, useState } from "react";
import EntryForm from "../components/EntryForm";

const Entries = ({ ref, handleClose, entries, collection }) => {
  const [editEntry, setEditEntry] = useState(null); // State to hold the entry being edited
  const editRef = useRef(null); // Ref for the edit modal

  const handleEditModal = (entry) => {
    setEditEntry(entry); // Set the entry to be edited
    editRef.current.showModal(); // Open the AddEntry modal
  };

  const handleEditModalClose = () => {
    editRef.current.close(); // Close the AddEntry modal
  };

  if (!collection) {
    return null; // Return null if collection is not available
  }

  return (
    <>
      {/* Entries Modal */}
      <dialog ref={ref} className="modal">
        <div className="modal-box max-h-1/2 overflow-y-auto">
          <ul className="list bg-base-100 rounded-box shadow-md">
            {/* Always show the collection name */}
            <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
              {collection.name}
            </li>

            {/* Render entries only if the array is not empty */}
            {entries.length > 0 ? (
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
                  <button className="btn btn-square btn-ghost">
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
            <button type="button" onClick={handleClose} className="btn">
              Close
            </button>
          </div>
        </div>
      </dialog>
      {/* AddEntry Modal */}
      <EntryForm
        ref={editRef}
        handleClose={handleEditModalClose} // Switch back to Entries modal
        entry={editEntry} // Pass the entry to be edited
      />
    </>
  );
};

export default Entries;

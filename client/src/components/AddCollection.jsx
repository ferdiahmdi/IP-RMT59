const AddCollection = ({ onSubmit, ref, handleClose, setName }) => {
  return (
    <dialog ref={ref} className="modal">
      <form onSubmit={onSubmit} className="modal-box form-control">
        <h3 className="font-bold text-lg mb-6">Create New Collection</h3>
        <input
          type="text"
          placeholder="Collection name"
          className="input input-bordered mb-4"
          required
          onChange={(event) => setName(event.target.value)}
        />
        <div className="modal-action">
          <button type="submit" className="btn btn-neutral">
            Create
          </button>
          <button type="button" onClick={handleClose} className="btn">
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default AddCollection;

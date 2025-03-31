const CollectionCard = ({ collection, handleClick }) => {
  return (
    <button onClick={handleClick} className="card shadow-md cursor-pointer">
      <div className="card-body">
        <h2 className="card-title">{collection.name}</h2>
        <p className="text-sm text-gray-500">
          {collection.Entries.length || 0} entries
        </p>
      </div>
    </button>
  );
};

export default CollectionCard;

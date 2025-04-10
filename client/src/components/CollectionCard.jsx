const CollectionCard = ({ collection, handleClick, loadCoverImageUpload }) => {
  // console.log(collection.coverImage);
  const coverImage =
    loadCoverImageUpload.value && loadCoverImageUpload.id === collection.id
      ? ""
      : collection.coverImage
      ? collection.coverImage
      : "";

  return (
    <button
      onClick={handleClick}
      className={`card shadow-md cursor-pointer bg-cover bg-center flex justify-center items-center p-4`}
      style={{
        backgroundImage: `url(${coverImage})`
      }}
    >
      <div className="card-body bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg">
        <h2 className="card-title">{collection.name}</h2>
        <p className="text-sm text-gray-800 dark:text-gray-400">
          {collection.Entries.length || 0} entries
        </p>
      </div>
    </button>
  );
};

export default CollectionCard;

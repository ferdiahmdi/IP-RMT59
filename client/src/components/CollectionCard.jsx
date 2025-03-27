import { Link } from "react-router";

const CollectionCard = ({ collection }) => {
  const userId = localStorage.getItem("userId");

  return (
    <Link
      to={`/collections/${userId}/${collection.id}`}
      className="card shadow-md"
    >
      <div className="card-body">
        <h2 className="card-title">{collection.name}</h2>
        <p className="text-sm text-gray-500">
          {collection.Entries.length || 0} entries
        </p>
      </div>
    </Link>
  );
};

export default CollectionCard;

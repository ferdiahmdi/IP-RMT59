import React from "react";

const AnimeCard = ({ anime, handleClick }) => {
  return (
    <button
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <figure className="w-full">
        <img
          src={
            anime.images.webp.large_image_url ||
            "https://via.placeholder.com/150"
          }
          alt={anime.title || "Anime"}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{anime.title || "Untitled"}</h2>
        <p className="text-sm text-gray-500"></p>
      </div>
    </button>
  );
};

export default AnimeCard;

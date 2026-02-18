import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../../css/songs/SongCard.css";

const SongCard = ({ song, onLike, isLiked, onPlay }) => {
  return (
    <div className="song-card" onClick={onPlay}>
    
      <div className="song-card-image">
        <img src={song.image} alt={song.name} loading="lazy" />
      </div>

      <div className="song-card-info">
        <h4 className="song-title">{song.name}</h4>
        <p className="song-artist">{song.artist_name}</p>
      </div>

      {/*  Like button */}
      <button
        className="song-like-btn"
        onClick={(e) => {
          e.stopPropagation(); 
          onLike(song);
        }}
      >
        {isLiked ? (
          <FaHeart color="#ff3c3c" size={18} />
        ) : (
          <FaRegHeart color="#a855f7" size={18} />
        )}
      </button>
    </div>
  );
};

export default SongCard;

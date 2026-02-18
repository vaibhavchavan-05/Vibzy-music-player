import React from "react";
import "../../css/songs/SongGrid.css";
import SongCard from "./SongCard";

const SongGrid = ({ songs, onSelectFavourite }) => {
  if(!songs || songs.length === 0){
    return(
      <div className="song-grid-empty">
        <p className="empty-text">No Favourite songs yet</p>
        <p className="empty-subtext">
          Start exploring and add songs to your favourites!
        </p>
      </div>
    );
  }
  return (
    <div className="song-grid-wrapper">
      <h2 className="song-grid-heading">Your Favourites</h2>
      <div className="song-grid">
        {songs.map((song) => (
          <SongCard
            key={song.id} 
            song={song}
            onPlay={() => onSelectFavourite(song)} 
          />
        ))}
      </div>
    
    </div>
  );
};

export default SongGrid;

import React from "react";
import "../../css/footer/SongDetail.css";

const SongDetail = ({ currentSong }) => {
  const fallback = {
    name: "Song not selected",
    artist_name: "Not selected",
    image:
      "https://usercontent.jamendo.com?type=album&id=24&width=300&trackid=168",
  };

  const data = currentSong || fallback;

  return (
    <div className="songdetail-root">
      <div className="songdetail-image-wrapper">
        <img src={data.image} alt={data.name} className="songdetail-image" />
      </div>

      <div className="songdetail-text">
        <h3 className="songdetail-title">{data.name}</h3>
        <p className="songdetail-artist">{data.artist_name}</p>
      </div>
    </div>
  );
};

export default SongDetail;

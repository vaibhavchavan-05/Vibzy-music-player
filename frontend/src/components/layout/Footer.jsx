import React from "react";

import SongDetail from "../player/SongDetail";
import ControlArea from "../player/ControlArea";
import Features from "../player/Features";

import "../../css/footer/Footer.css";

const Footer = ({playerState, playerControls, playerFeatures}) => {
  // static player state (dummy)
  /*const playerState = {
    currentSong: {
      name: "Believer",
      artist_name: "Imagine Dragons",
      image:
        "https://upload.wikimedia.org/wikipedia/en/5/5c/Imagine-Dragons-Believer-art.jpg",
    },
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 50,
  };*/

  return (
    <footer className="footer-root footer-glow">
      <SongDetail currentSong={playerState.currentSong} />
      <ControlArea playerState={playerState} playerControls={playerControls}/>
      <Features playerState={playerState} playerFeatures={playerFeatures} />
    </footer>
  );
};

export default Footer;

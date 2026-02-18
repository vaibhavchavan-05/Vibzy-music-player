import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";

import "../css/pages/HomePage.css";
import useAudioPlayer from "../hooks/useAudioPlayer";
import EditProfile from "../components/auth/EditProfile";
import Modal from "../components/common/Modal";

const Homepage = () => {
  const [view, setView] = useState("home");
  const [songs, setSongs] = useState([]);
  const [searchSongs, setSearchSongs] = useState([]);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const auth = useSelector((state) => state.auth);
  

  const songsToDisplay = view === "search" ? searchSongs : songs;


  const {
    audioRef,
    currentIndex,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleSeek,
    handleChangeVolume,
  } = useAudioPlayer(songsToDisplay || []);

  // Reload and play audio whenever currentSong changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (audioRef.current.src !== currentSong.audio) {
        audioRef.current.load();
      }
      if (audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => console.log("Playing:", currentSong.name))
          .catch((err) => console.error("Play error:", err));
      }
    }
  }, [currentSong]);

  const playerState = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
  };

  const playerControls = {
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleSeek,
  };

  const playerFeatures = {
    onToggleMute: handleToggleMute,
    onToggleLoop: handleToggleLoop,
    onToggleShuffle: handleToggleShuffle,
    onChangeSpeed: handleChangeSpeed,
    onChangeVolume: handleChangeVolume,
  };

  // Fetch initial songs
  useEffect(() => {
    const fetchInitialSongs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/songs`);
        setSongs(res.data.results || []);
      } catch (error) {
        console.error("Error while fetching the songs", error);
      }
    };
    fetchInitialSongs();
  }, []);

  const loadPlaylist = async (tag) => {
    if (!tag) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${tag}`
      );
      setSongs(res.data.results || []);
    } catch (error) {
      console.error("Failed to load playlist", error);
      setSongs([]);
    }
  };

  const handleSelectSong = (index) => {
    playSongAtIndex(index);
    console.log("Playing song URL:", songsToDisplay[index]?.audio);
  };

  const handlePlayFavourite = (song) => {
    const favourites = auth.user?.favourites || [];
    if (!favourites.length) return;

    const index = favourites.findIndex((fav) => fav.id === song.id);
    setSongs(favourites);
    setView("home");

    setTimeout(() => {
      if (index !== -1) {
        playSongAtIndex(index);
      }
    }, 0);
  };
  


  return (
    <div className="homepage-root">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      >
        {currentSong && <source src={currentSong.audio} type="audio/mpeg" />}
      </audio>

      <div className="homepage-main-wrapper">
        <div className="homepage-sidebar">
          <SideMenu
            setView={setView}
            view={view}
            onOpenEditProfile={() => setOpenEditProfile(true)}
          />
        </div>

        <div className="homepage-content">
          <MainArea
            view={view}
            currentIndex={currentIndex}
            onSelectSong={handleSelectSong}
            onSelectFavourite={handlePlayFavourite}
            onSelectTag={loadPlaylist}
            songsToDisplay={songsToDisplay}
            setSearchSongs={setSearchSongs}
          />
        </div>
      </div>

      <Footer
        playerState={playerState}
        playerControls={playerControls}
        playerFeatures={playerFeatures}
      />

      {openEditProfile && (
        <Modal onClose={() => setOpenEditProfile(false)}>
          <EditProfile onClose={() => setOpenEditProfile(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Homepage;

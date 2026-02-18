import { useReducer, useState, useRef, useEffect } from "react";

const initialAudioState = {
  isPlaying: false,
  isLoading: false,
  volume: 1,
  loopEnabled: false,
  shuffleEnabled: false,
  playbackSpeed: 1,
  currentSong: null,
  currentIndex: null,
  currentTime: 0,
  isMuted: false,
};

function audioReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true };
    case "PLAY":
      return { ...state, isPlaying: true, isLoading: false };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "MUTE":
      return { ...state, isMuted: true, volume: 0 };
    case "UNMUTE":
      return { ...state, isMuted: false };
    case "SET_VOLUME":
      return { ...state, volume: action.payload };
    case "TOGGLE_LOOP":
      return { ...state, loopEnabled: !state.loopEnabled, shuffleEnabled: false };
    case "TOGGLE_SHUFFLE":
      return { ...state, shuffleEnabled: !state.shuffleEnabled, loopEnabled: false };
    case "SET_PLAYBACK_SPEED":
      return { ...state, playbackSpeed: action.payload };
    case "SET_CURRENT_TRACK":
      return {
        ...state,
        currentIndex: action.payload.index,
        currentSong: action.payload.song,
        isLoading: true,
        currentTime: 0,
      };
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.payload };
    default:
      return state;
  }
}

const useAudioPlayer = (songs = []) => {
  const [audioState, dispatch] = useReducer(audioReducer, initialAudioState);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.preload = "auto";
  }

  const previousVolumeRef = useRef(1);

  /* -------------------- Effects -------------------- */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = audioState.volume;
    audio.playbackRate = audioState.playbackSpeed;
    audio.loop = audioState.loopEnabled;

    const updateTime = () => dispatch({ type: "SET_CURRENT_TIME", payload: audio.currentTime });
    const setMeta = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setMeta);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setMeta);
    };
  }, [audioState.volume, audioState.playbackSpeed, audioState.loopEnabled]);

  /* -------------------- Controls -------------------- */
  const playSongAtIndex = (index) => {
    if (!songs.length || index < 0 || index >= songs.length) return;
    const audio = audioRef.current;
    const song = songs[index];

    dispatch({ type: "SET_CURRENT_TRACK", payload: { index, song } });

    if (audio.src !== song.audio) {
      audio.src = song.audio;
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => dispatch({ type: "PLAY" }))
        .catch((e) => {
          if (e.name !== "AbortError") {
            console.error(e);
          }
        });
    }

    // Optional: preload next song
    const nextIndex = (index + 1) % songs.length;
    if (songs[nextIndex]) {
      const preloadAudio = new Audio();
      preloadAudio.src = songs[nextIndex].audio;
    }
  };

  const handleTogglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
        dispatch({ type: "PLAY" });
      } else {
        audio.pause();
        dispatch({ type: "PAUSE" });
      }
    } catch (e) {
      if (e.name !== "AbortError") console.error(e);
    }
  };

  const handleNext = () => {
    if (!songs.length) return;

    if (audioState.shuffleEnabled && songs.length > 1) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * songs.length);
      } while (randomIndex === audioState.currentIndex);

      playSongAtIndex(randomIndex);
    } else {
      const nextIndex = (audioState.currentIndex + 1) % songs.length;
      playSongAtIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    if (!songs.length) return;
    if (audioState.currentIndex === null) {
      playSongAtIndex(0);
      return;
    }

    const prevIndex = (audioState.currentIndex - 1 + songs.length) % songs.length;
    playSongAtIndex(prevIndex);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    dispatch({ type: "SET_CURRENT_TIME", payload: audio.currentTime || 0 });
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration || 0);
    audio.playbackRate = audioState.playbackSpeed;
    audio.volume = audioState.volume;
    audio.muted = audioState.isMuted;

    dispatch({ type: "PLAY" });
  };

  const handleEnded = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioState.loopEnabled) {
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          dispatch({ type: "PLAY" });
          dispatch({ type: "SET_CURRENT_TIME", payload: 0 });
        })
        .catch((e) => console.error("Replay error", e));
    } else {
      handleNext();
    }
  };

  const handleToggleMute = () => {
    const audio = audioRef.current;
    if (audioState.isMuted) {
      const restoreVolume = previousVolumeRef.current || 1;
      audio.muted = false;
      audio.volume = restoreVolume;
      dispatch({ type: "UNMUTE" });
      dispatch({ type: "SET_VOLUME", payload: restoreVolume });
    } else {
      previousVolumeRef.current = audioState.volume || 1;
      audio.muted = true;
      audio.volume = 0;
      dispatch({ type: "MUTE" });
      dispatch({ type: "SET_VOLUME", payload: 0 });
    }
  };

  const handleToggleLoop = () => dispatch({ type: "TOGGLE_LOOP" });
  const handleToggleShuffle = () => dispatch({ type: "TOGGLE_SHUFFLE" });
  const handleChangeSpeed = (newSpeed) => {
    const audio = audioRef.current;
    dispatch({ type: "SET_PLAYBACK_SPEED", payload: newSpeed });
    if (audio) audio.playbackRate = newSpeed;
  };
  const handleSeek = (newTime) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = newTime;
    dispatch({ type: "SET_CURRENT_TIME", payload: newTime });
  };
  const handleChangeVolume = (newVolume) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (newVolume > 0) previousVolumeRef.current = newVolume;
    dispatch({ type: "SET_VOLUME", payload: newVolume });
    audio.volume = newVolume;

    if (newVolume === 0) {
      audio.muted = true;
      dispatch({ type: "MUTE" });
    } else if (audioState.isMuted) {
      audio.muted = false;
      dispatch({ type: "UNMUTE" });
    }
  };

  return {
    audioRef,
    currentIndex: audioState.currentIndex,
    currentSong: audioState.currentSong,
    isPlaying: audioState.isPlaying,
    currentTime: audioState.currentTime,
    isLoading: audioState.isLoading,
    duration,
    isMuted: audioState.isMuted,
    loopEnabled: audioState.loopEnabled,
    shuffleEnabled: audioState.shuffleEnabled,
    playbackSpeed: audioState.playbackSpeed,
    volume: audioState.volume,
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleSeek,
    handleChangeVolume,
  };
};

export default useAudioPlayer;

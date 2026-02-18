const AudioElement = ({ audioRef, onTimeUpdate, onLoadedMetadata, onEnded }) => {
  return (
    <audio
      ref={audioRef}
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={onLoadedMetadata}
      onEnded={onEnded}
    />
  );
};

export default AudioElement;

export const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "00:00";

    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");

      return `${minutes}:${seconds}`;

}
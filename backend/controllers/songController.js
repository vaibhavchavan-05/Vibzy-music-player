import axios from "axios";

// Fetch songs from Jamendo API
const getSongs = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.jamendo.com/v3.0/tracks/",
      {
        params: {
          client_id: "bce61acf",
          format: "json",
          limit: 15,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("getSongs error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Fetch playlist by tag
const getPlaylistByTag = async (req, res) => {
  try {
    const tag = (req.params.tag || req.query.tag || "").toString();
    if (!tag)
      return res.status(400).json({ message: "Missing tag parameter" });

    const limit = parseInt(req.query.limit ?? "10", 10) || 10;

    const response = await axios.get("https://api.jamendo.com/v3.0/tracks/", {
      params: {
        client_id: "bce61acf",
        format: "jsonpretty",
        tags: tag,
        limit,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "getPlaylistByTag error:",
      error?.response?.data ?? error.message ?? error
    );
    res.status(500).json({ message: "Failed to fetch playlist" });
  }
};

// Add/remove favourite for logged-in user
const toggleFavourite = async (req, res) => {
  try {
    const user = req.user; 
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const song = req.body.song;
    if (!song?.id) return res.status(400).json({ message: "Song ID is required" });

    // Ensure favourites array exists
    user.favourites = user.favourites || [];

    // Check if song is already in favourites
    const existsIndex = user.favourites.findIndex(fav => fav.id.toString() === song.id.toString());

    if (existsIndex !== -1) {
      // Remove from favourites
      user.favourites.splice(existsIndex, 1);
    } else {
      // Add to favourites
      user.favourites.push(song);
    }

    await user.save();

    res.status(200).json(user.favourites); // send updated favourites
  } catch (error) {
    console.error("toggleFavourite error:", error);
    res.status(500).json({ message: "Could not update favourites" });
  }
};

export { getSongs, getPlaylistByTag, toggleFavourite };

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPlaylistByTag,
  getSongs,
  toggleFavourite,
} from "../controllers/songController.js";

const songRouter = express.Router();

songRouter.get("/", getSongs);
songRouter.get("/playlistByTag/:tag", getPlaylistByTag);
songRouter.post("/favourite", protect, toggleFavourite);
songRouter.get("/favourite", protect, (req, res) => {
  res.json(req.user.favourites);
});

export default songRouter;

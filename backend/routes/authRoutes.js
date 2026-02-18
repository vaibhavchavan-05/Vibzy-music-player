import express from "express";
import {
    editProfile,
    signup,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.patch("/profile", protect, editProfile);

// Protected route
router.get("/me", protect, getMe);

export default router;

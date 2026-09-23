import express from "express";
import { signup,login, logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

// protectRoute is a middleware function that checks if the user is authenticated before allowing access to the route. It ensures that only logged-in users can update their profile information.
router.put("/update-profile", protectRoute, updateProfile);

// If user refreshes the page, we can check if the user is still logged in by checking the token in the cookies. If the token is valid, we can return the user data in the response.
router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

export default router;
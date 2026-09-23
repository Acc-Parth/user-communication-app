import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";

export const protectRoute = async(req, res, next) => {
    try{
        // Fetch token from cookies and check if token exists
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message: "Unauthorized - No token provided"});

        // If token exists, verify function will validate by checking the signature and returns the decoded payload if valid. If invalid, it will throw an error.
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if(!decoded) res.status(401).json({message: "Unauthorized - Invalid token"});

        // Fetch the user from the database using the decoded userId, excluding the password field for security reasons and return the user data in the response.
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) res.status(404).json({message: "User not found"});

        // Attach the user object to the request for further use in the route handler
        req.user = user; 
        next(); // Call the updateProfile controller function to handle the profile update logic after successful authentication and user retrieval.
    }
    catch(error){
        console.log("Error in protectRoute middleware", error);
        res.status(500).json({message: "Internal server error"});
    }
}
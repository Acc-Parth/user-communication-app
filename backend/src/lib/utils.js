import jwt from 'jsonwebtoken';
import {ENV} from "./env.js";

export const generateToken = (userId, res) => {
    // Generate a JWT token with the user ID and a secret key, set to expire in 7 days
    const token = jwt.sign({userId: userId}, ENV.JWT_SECRET, {expiresIn: '7d'});
    //Send the token via a cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
        httpOnly: true, // The cookie cannot be accessed via JavaScript, enhancing security. Prevents XSS attacks.
        sameSite: "strict", // The cookie will only be sent in requests originating from the same site, preventing CSRF attacks.
        secure: ENV.NODE_ENV === "development" ? false : true, // The cookie will only be sent over HTTPS in production, enhancing security.
    });

    return token; // Return the generated token for further use if needed
}
import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    try{
        // Check if the request exceeds rate limits or is from a bot or spoofed bot. If it does, respond with a 429 status code and a message indicating that the request was blocked by Arcjet protection.
        const decision = await aj.protect(req);

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message: "Rate Limit exceeded. Please try again later."});
            }
            else if(decision.reason.isBot()){
                return res.status(403).json({message: "Request blocked. Bot detected."});
            }
            else{
                return res.status(403).json({message: "Access denied by security policy."});
            }
        }

        // Check for spoofed bots
        if(decision.results.some(isSpoofedBot)){
            return res.status(403).json({
                error: "Spoofed Bot Detected",
                message: "Malicious Bot Activity Detected",
            })
        }

        next();
    }
    catch(error){
        // Log the error for debugging purposes and call next() to pass control to the next middleware function in the stack, allowing the request to proceed even if Arcjet protection fails.
        console.log("Error in arcjetProtection middleware", error);
        next();
    }
}
import rateLimit from '../lib/upstash.js'

const upstashProtection = async (req, res, next) => {
    try{
        // Check if the request exceeds rate limits. If it does, respond with a 429 status code and a message indicating that the request was blocked by Upstash protection.
        const {success} = await rateLimit.limit('my-limit-key');

        if(!success){
            return res.status(429).json({message: "Rate Limit exceeded. Please try again later."});
        }   

        next();
    }
    catch(error){
        console.log("Error in upstashProtection middleware", error);
        next(error);
    }
}

export default upstashProtection;
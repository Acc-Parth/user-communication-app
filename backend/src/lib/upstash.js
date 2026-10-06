import {Ratelimit} from '@upstash/ratelimit'
import {Redis} from '@upstash/redis'
import {ENV} from './env.js'

//Create a new ratelimiter, that allows 100 requests per 60 seconds
const rateLimit = new Ratelimit({
    // The redis client
    redis: new Redis({
        url: ENV.UPSTASH_REDIS_REST_URL,
        token: ENV.UPSTASH_REDIS_REST_TOKEN
    }),
    // The limiter that will be used
    limiter: Ratelimit.slidingWindow(100, '60 s'),
});

export default rateLimit;
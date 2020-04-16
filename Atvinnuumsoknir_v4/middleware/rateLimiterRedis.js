// Limits the number of requests that each IP address can send per specified duration,
// e.g. 5 requests per 1 second by IP

const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');

// TODO: This might change on heroku, in which case it must be updated.
// Can't figure out how to get the info at runtime.
const redisPort = 12549;
const redisHost = 'h:pdc2f424e132a36cf95d452abe2a2f64c1e18782634933f5e82cd173cf7668889@ec2-52-50-246-38.eu-west-1.compute.amazonaws.com';

const redisClient = redis.createClient({
  url: `redis://${redisHost}:${redisPort}/`,
  enable_offline_queue: false,
});

const rateLimiter = new RateLimiterRedis({
  redis: redisClient,
  keyPrefix: 'middleware',
  points: 10, // 10 requests
  duration: 1, // per 1 second by IP
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      // console.log('rateLimiterMiddleware' + req.ip);
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
    });
};

module.exports = rateLimiterMiddleware;

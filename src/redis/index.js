const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis);

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.on("error", err => {
  console.error("Redis Error : " + err);
});

module.exports = { redisClient };

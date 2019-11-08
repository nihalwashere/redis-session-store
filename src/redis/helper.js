const { redisClient } = require("./index");

const setKey = (key, value) => {
  try {
    const result = redisClient.set(key.toString(), value);
    return result;
  } catch (err) {
    throw new Error("[REDIS] Failed to set key -> ", err);
  }
};

const getKey = async key => {
  try {
    const result = await redisClient.getAsync(key.toString());
    return result;
  } catch (err) {
    throw new Error("[REDIS] Failed to get key -> ", err);
  }
};

const setKeyWithExpiry = (key, value, expiry) => {
  try {
    const result = redisClient.set(key.toString(), value, "EX", expiry);
    return result;
  } catch (err) {
    throw new Error("[REDIS] Failed to set key with expiry -> ", err);
  }
};

const delKey = async key => {
  try {
    const result = await redisClient.delAsync(key.toString());
    return result;
  } catch (err) {
    throw new Error("[REDIS] Failed to delete key -> ", err);
  }
};

// delKey("name").then(res => console.log(res));

module.exports = { setKey, getKey, setKeyWithExpiry, delKey };

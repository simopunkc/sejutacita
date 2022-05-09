require('dotenv').config();
var Redis = require("ioredis");
const { env } = process;

let _redis = null
const connectRedis = async () => {
  _redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  });
  return _redis;
};

const getRedis = async () => {
  return _redis;
}

module.exports = {
  connectRedis,
  getRedis,
};
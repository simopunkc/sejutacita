require('dotenv').config();
var Redis = require("ioredis");
const { env } = process;
var redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
});

module.exports = { redis };
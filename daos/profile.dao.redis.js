const profileDao = require("./profile.dao");

async function redisRead(key, tableDB, mongodbConnection, redisConnection, idDB) {
  let rawData;
  let checkCache = await redisConnection.redis.exists(key);
  if (checkCache) {
    let redisData = await redisConnection.redis.get(key);
    rawData = JSON.parse(redisData);
  } else {
    rawData = await profileDao[tableDB](mongodbConnection, idDB)
      .then(async (data) => {
        if (data.email) {
          await redisConnection.redis.set(key, JSON.stringify(data));
          return data;
        } else {
          return JSON.stringify(data);
        }
      })
      .catch((error) => {
        return error.message;
      });
  }
  return rawData;
}

async function getOneUser(mongodbConnection, redisConnection, idDB) {
  let key = `gou_${idDB}`;
  return await redisRead(key, "getOneUser", mongodbConnection, redisConnection, idDB);
}

async function deleteOneUser(redisConnection, idDB) {
  let key = `gou_${idDB}`;
  await redisConnection.redis.del(key);
}

module.exports = {
  getOneUser,
  deleteOneUser,
};

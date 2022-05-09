require('dotenv').config();
const mongoose = require('mongoose');
const { env } = process;

let _db = null
const connectDb = async () => {
  _db = await mongoose.connect(`mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return _db;
};

const getDb = async () => {
  return _db;
}

module.exports = {
  connectDb,
  getDb,
};
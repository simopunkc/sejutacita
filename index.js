require('dotenv').config();
const app = require("./server");
const database = require('./models/mongodb.connection');
(async ()=>{
  try {
    const mongodbConnection = await database.getModel();
    const query1 = { email: "admin@web.com" },
    update1 = { id: "CVeomEaSrNq", firstName: "admin", lastName: "sejutacita", email: "admin@web.com", createdAt: "2022-05-06 03:51:56", updatedAt: "2022-05-06 03:51:56" },
    options1 = { upsert: true, new: true, setDefaultsOnInsert: true };
    const query2 = { email: "user1@web.com" },
    update2 = { id: "CJy6ZwPO8X0", firstName: "user", lastName: "pertama", email: "user1@web.com", createdAt: "2022-05-06 03:51:56", updatedAt: "2022-05-06 03:51:56" },
    options2 = { upsert: true, new: true, setDefaultsOnInsert: true };
    const query3 = { username: "admin" },
    update3 = { id_user_profiles: "CVeomEaSrNq", username: "admin", password: "$2b$08$ZYq27bAmS39JMKB1yauniOIl6TEq8QajPB83iC2V1ypvJQa8koXFa", role: 1 },
    options3 = { upsert: true, new: true, setDefaultsOnInsert: true };
    const query4 = { username: "user1" },
    update4 = { id_user_profiles: "CJy6ZwPO8X0", username: "user1", password: "$2b$08$ZYq27bAmS39JMKB1yauniOIl6TEq8QajPB83iC2V1ypvJQa8koXFa", role: 2 },
    options4 = { upsert: true, new: true, setDefaultsOnInsert: true };
    await Promise.all([
      mongodbConnection.userProfile.findOneAndUpdate(query1, update1, options1),
      mongodbConnection.userProfile.findOneAndUpdate(query2, update2, options2),
      mongodbConnection.userLogin.findOneAndUpdate(query3, update3, options3),
      mongodbConnection.userLogin.findOneAndUpdate(query4, update4, options4)
    ]);
  } catch (e) {
    console.log(e.message)
  }
})()
app.get('/', (_, res) => {
  res.status(200).json({
    status: true,
    message: 'API is running'
  })
});
const PORT = process.env.PORT || 8000;

module.exports = app.listen(PORT);
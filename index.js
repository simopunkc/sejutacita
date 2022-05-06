require('dotenv').config();
const app = require("./server")
const db = require('./models');
(async ()=>{
  try {
    await db.sequelize.sync();
    await db.userProfile.bulkCreate([
      { id: 1, firstName: "admin", lastName: "sejutacita", email: "admin@web.com", createdAt: "2022-05-06 03:51:56", updatedAt: "2022-05-06 03:51:56" },
      { id: 2, firstName: "user", lastName: "pertama", email: "user1@web.com", createdAt: "2022-05-06 03:51:56", updatedAt: "2022-05-06 03:51:56" },
    ],{ ignoreDuplicates: true }).then(() => console.log("initialize row data user profile"));
    await db.userLogin.bulkCreate([
      { id_user_profiles: 1, username: "admin", password: "$2b$08$ZYq27bAmS39JMKB1yauniOIl6TEq8QajPB83iC2V1ypvJQa8koXFa", role: 1 },
      { id_user_profiles: 2, username: "user1", password: "$2b$08$ZYq27bAmS39JMKB1yauniOIl6TEq8QajPB83iC2V1ypvJQa8koXFa", role: 2 },
    ],{ ignoreDuplicates: true }).then(() => console.log("initialize row data user login"));
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
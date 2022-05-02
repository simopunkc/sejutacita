require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const admin = require('./routes/admin.route');
const user = require('./routes/user.route');
const login = require('./routes/login.route');

const app = express();

db.sequelize.sync();

app.get('/', (_, res) => {
  res.status(200).json({
    status: true,
    message: 'API is running'
  })
});

app.use(express.json());
app.use(cors());

app.use('/admin', admin);
app.use('/user', user);
app.use('/login', login);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Running server at port ${PORT}`);
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('./routes/admin.route');
const user = require('./routes/user.route');
const login = require('./routes/login.route');
const register = require('./routes/register.route');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/admin', admin);
app.use('/user', user);
app.use('/login', login);
app.use('/register', register);
module.exports = app
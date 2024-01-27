require('dotenv').config();
const express = require('express');
const app = express();
const loginRouter = require('./routes/loginRouter');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the loginRouter at the base path "/"
app.use('/', loginRouter);

module.exports = app;
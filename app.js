// create the express app object and add my middleware
const express = require('express');
const app = express();
const loginRouter = require('./routes/loginRouter');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app register router
app.use('/login', loginRouter);

module.exports = app;
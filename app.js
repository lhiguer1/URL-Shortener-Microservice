var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const mongoose = require('mongoose');

require('dotenv').config();

// 1) Install & Set up mongoose
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


var urlRouter = require('./routes/url');

var app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', urlRouter);

module.exports = app;

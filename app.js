var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var translateRouter = require('./routes/translate');
var wiktionaryRouter = require('./routes/define');
var dataRouter = require('./routes/data');
var adminRouter = require('./routes/admin');
var scriptsRouter = require('./routes/scripts');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.raw({ inflate: true, limit: '500kb', type: 'image/*' }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/translate', translateRouter);
app.use('/define', wiktionaryRouter);
app.use('/data', dataRouter);
app.use('/admin', adminRouter);
app.use('/scripts', scriptsRouter);

app.use('/scripts', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/')));

module.exports = app;

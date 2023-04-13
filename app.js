var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catalogRouter = require("./routes/catalog"); //Import routes for "catalog" area of site

var app = express();

app.use(express.static('public'))

// Setup mongoose connection
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// Define the database URL to connect to.
const mongoDB = "mongodb+srv://deeshonhunukumbura:nyctophile101@cluster0.c0cwizo.mongodb.net/local_library?retryWrites=true&w=majority"

// Wait for databse to connect, logging an error if there is a problem
main().catch(err => console.log(err))
async function main() {
  await mongoose.connect(mongoDB)
}



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

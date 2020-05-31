var createError = require('http-errors');
var express = require('express');
var Customer  = require('./models/customer');
var Product = require('./models/product');
var User = require('./models/user');
var mongoose  = require('mongoose');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var customerRouter = require('./routes/customers');
var productsRouter = require('./routes/products');
var itemsRouter = require('./routes/items');
var app = express();

// * DB Connection ************************
var dbOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  auto_reconnect: true
};
mongoose.connect("mongodb+srv://beingzero:beingzero@cluster0-i1mul.mongodb.net/test?retryWrites=true&w=majority", dbOptions);
mongoose.connection.on('connected', function () {
  console.log("Connected to DB");
});
mongoose.connection.on('error', function (err) {
  console.log("Error while connecting to DB: " + err);
});

app.use(cors());
// ****** Body Parser **********
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/customers',customerRouter);
app.use('/products', productsRouter);
app.use('/item', itemsRouter);
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var empUploadRouter=require('./routes/empUpload');
var empListRouter=require('./routes/empList');
var paySlipDetailsRouter=require('./routes/payslipDetails');
var payslipRouter=require('./routes/payslip');
var mailRouter=require('./routes/mail');
var empUpdateRouter=require('./routes/empUpdate');
var psUpdateRouter=require('./routes/psUpdate');
var empIDRouter=require('./routes/empID');
var psListRouter=require('./routes/psList');
var pdfRouter=require('./routes/pdfGen');
var idDetailsRouter=require('./routes/idDetails');
var loginRouter=require('./routes/login');
var yearRouter=require('./routes/year');
var forgotRouter = require('./routes/forgot');
//var pdfgenRouter=require('./routes/pdfgenrator');
//var htmlRouter=require('./routes/html');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Methods","*");
  res.header("Access-Control-Allow-Headers", "*");
   next(); 
  });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login',loginRouter);
app.use('/empUpload',empUploadRouter);
app.use('/emplist',empListRouter);
app.use('/payslipDetails',paySlipDetailsRouter);
app.use('/payslip',payslipRouter);
app.use('/mail',mailRouter);
app.use('/empupdate',empUpdateRouter);
app.use('/psupdate',psUpdateRouter);
app.use('/empID',empIDRouter);
app.use('/psList',psListRouter);
app.use('/psPdf',pdfRouter);
app.use('/idDetails',idDetailsRouter);
app.use('/login',loginRouter);
app.use('/year',yearRouter);
app.use('/forgot',forgotRouter);
//app.use('/pdfgen',pdfgenRouter);
//app.use('/html',htmlRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//var argv = parseArgs(process.argv.slice(2))

//const port = argv.port || argv.p || 3200;
//const port = 3200;

//console.log(`Listening on port ${port}...`)

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3200,function(err){
  if(err){
    console.log("PORT NOT AVAILABLE",err);
  }
  else{
    console.log("LISTENNING AT 3200");
  }
})


module.exports = app;

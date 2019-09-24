var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const  cookieParse=require('cookie-parser')
const  session = require('express-session')
const db = require('./db/connect')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gradeRouter = require('./routes/grade');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));






const passport = require('passport');
app.use('/', indexRouter);
app.use('/api/user',usersRouter);
app.use('/api/grade', passport.authenticate('jwt', { session: false }),async(req,res,next)=>{
	let sql = `select login_time,token from online,user where user.id=${req.user.id} and user.id = online.uid`
	let data = await db.query(sql)
	let login_time =parseInt(data[0].login_time)+60*60*1000
	if (req.headers.authorization == data[0].token) {
		if (Date.now() <= login_time) {
			console.log("token有效");
			let new_login_time_sql = `update online set login_time = '${Date.now()}' where uid = ${req.user.id}`
			await db.query(new_login_time_sql)
			next()
		  }else{
			console.log("token过期");
			let sql_detele_token =  `delete from online where uid = ${req.user.id}`
			await db.query(sql_detele_token)
			res.status(401).send({msg:"token过期，请重新登录"})
		  }
	}else{
	  res.status(401).send({msg:"token无效，请重新登录"})
	}
},gradeRouter);

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

app.use(passport.initialize());
require('./config/possport')(passport);

var port = 3000
app.listen(port,()=>{
  console.log('server start:'+port)
})
module.exports = app;

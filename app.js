// dependencies
var path = require('path');
var express = require('express');
//var logger = require('express-logger');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var errorHandler = require('errorhandler');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// main config
var app = express();
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(morgan('dev'));
//app.use(logger({path: 'log.txt'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());
app.use(cookieParser('cookie secret'));
app.use(session({
    secret: 'session secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose');

// routes
require('./routes')(app);
    

app.use(express.static(path.join(__dirname, 'public')));
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}else{
    app.use(errorHandler());
}


app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});

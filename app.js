var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var engine = require('ejs-locals');
var Database = require('./persister/database');
var passport = require('passport');
var bodyParser = require('body-parser');
var config = require('./config.json');
var LdapStrategy = require('passport-ldapauth').Strategy;
var expressSession = require('express-session');
var partials = require('express-partials');
var flash = require('connect-flash');


module.exports = app;
// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
app.set("view options",{
  "layout":false
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(expressSession(config.sessionOPTS));
app.use(flash());

passport.use(new LdapStrategy(config.LDAPOPTS));
app.use(passport.initialize());
app.use(passport.session());


app.use(function (req, res, next) {
      if(req.originalUrl=="/login"){
        return next();
      }
      if (req.session && req.session.passport && req.session.passport.user) {
        // console.log("Authenticated, Current user:" + JSON.stringify(req.session.passport.user));
        return next();
      } else {
        console.log("Not Authenticated");
      }
      res.redirect('/login');
    }
);


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

require('./routes/index')(app, passport);



app.use(expressSession({
  "secret": "ldap secret",
  "resave": false,
  "saveUninitialized": true,
  "cookie": {
    "httpOnly": true,
    "maxAge": 2419200000
  }
}));

require('./routes/index')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      "layout":false
    });
  });
}

Database.config(
    config && config.mongodb && config.mongodb.uri ? config.mongodb.uri : '',
    config && config.mongodb && config.mongodb.options ? config.mongodb.options : undefined,
    function(err, message) {
      if (!err) console.info('  - Mongodb is connected');

    }
);


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    "layout":false
  });
});



var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

/**
 * For passport
 */
var passport = require('passport');
var passportLocal = require('passport-local');
var expressSession = require('express-session');

app.use(cookieParser());
app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1200000}
}));

app.use(passport.initialize());
app.use(passport.session());

var routes = require('./routes/index');
var Users = require('./db/models/user');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


mongoose.connect('mongodb://localhost/app', function () {
    console.log("Connected to the database");
    /**
     * Run this the first time only
     */
    //mongoose.connection.db.dropDatabase(function () {
    //    console.log("Dropped database");
    //    new Users({
    //        loginName: 'sysAdmin',
    //        password: 'admin123',
    //        name: 'SysAdmin',
    //        phoneNo: '0000000',
    //        email: 'sysAdmin@app.com',
    //        data: {}
    //    }).save();
    //})
});






passport.use('local-login', new passportLocal.Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
}, function (req, username, password, done) {
    if (username && password) {
        Users.findOne({'loginName':username},{'password':1, _id:0},function(err,doc){
            if(err){
                console.log(err);
            }else{
                if(password == doc.password){
                    done(null, {id: 123, name: username});
                }else{
                    done(null, null);
                }
            }
        });
    } else {
        done(null, null);
    }
}));


passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    console.log('deserializeUser');
    done(null, {id: id, name: id});
});

module.exports = app;

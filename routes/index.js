/**
 * Essentials
 */
var express = require('express');
var passport = require('passport');
var router = express.Router();

/**
 * Models
 */
var Users = require('../db/models/user');


router.get('/', function (req, res, next) {
    res.render('index', {title: 'App'});
});

//router.get('/user/:id', function (req, res, next) {
//    if (req.isAuthenticated()) {
//    Users.findOne({'loginName':req.param('id')},{'password':1, _id:0},function(err,doc){
//        res.status(200).json(doc);
//    });
//    }else{
//        console.log('not logged in');
//    }
//});

router.get('/logon', passport.authenticate('local-login'), function (req, res, next) {
    if (req.isAuthenticated()) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,    Accept");
        res.status('success').json({"data": 'success'});
    }
});


router.get('/routes', function (req, res, next) {
    /**
     * Send all the possible request strings to the front-end
     */
    res.status(200).json({
        'home': '/'
    });
});

module.exports = router;

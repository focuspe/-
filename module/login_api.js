/**
 * Created by LZY on 2016/8/1.
 */
var app=require('../app.js');
var passport=require('passport');


module.exports={
    login:{
        post:function(){
            app.post('/login', passport.authenticate('ldapauth', {
                successRedirect: '/index',
                failureRedirect: '/login',
                failureFlash: true
            })
            );
        },
        get:function(){
            app.get('/login', function (req, res) {
                res.render('login', {message: req.flash('message')});
            });
        }
    },
    logout:{
        get:function(){
            app.get('/logout', function (req, res) {
                req.logout();
                res.redirect('/');
            });
        }
    },
    signUp:{
        get:function(){
            app.get('/signup', function (req, res) {
                res.render('/signup', {message: req.flash('message')});
            });
        },
        post:function(){
            app.post('/signup', passport.authenticate('signup', {
                successRedirect: '/login',
                failureRedirect: '/signup',
                failureFlash: true
            }));
        }
    }
};
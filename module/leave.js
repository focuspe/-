/**
 * Created by LZY on 2016/8/1.
 */
var app=require('../app.js');
var commons = require('../util/commons');

module.exports={
    leaveShow:{
        post:function(){
            app.post('/leave/show',  function (req, res) {
                var user = req.session['passport']['user'];
                console.log("---------------------------");
                console.log("user:" + JSON.stringify(user));
                res.render('holidayMgmt/leave_show', {message: req.flash('message'),
                showMsg:"this is show user leave"
                });
            });
        },
        get:function(){
            app.get('/leave/show', function (req, res) {
                var user = req.session['passport']['user'];
                // console.log("---------------------------");
                // console.log("user:" + JSON.stringify(user));
                // console.log(user.uid);
                commons.layout(user.uid, res,"holidayMgmt/leave_show");
            });
        }
    },
    leaveManage:{
        post:function(){
            app.post('/leave/manage', function (req, res) {
                res.render('holidayMgmt/leave_manage', {message: req.flash('message')});
            });
        },
        get:function(){
            app.get('/leave/manage', function (req, res) {
                if(req.session.passport.user.uid == "yoda"){
                    res.render('holidayMgmt/leave_manage',{message: req.flash('message'),
                        layout:'layout'});
                }
                else{
                    res.render('error',{layout:'layout1'});
                    res.redirect('/');
                }
            });
        }
    },
    leaveAdd:{
        post:function(){
            app.post('/leave/add', function (req, res) {
                res.render('holidayMgmt/leave_add', {message: req.flash('message')});
            });
        },
        get:function(){
            app.get('/leave/add', function (req, res) {
                var user = req.session['passport']['user'];
                commons.layout(user.uid, res,"holidayMgmt/leave_add");
            });
        }
    }
};

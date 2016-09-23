var app=require('../app.js');

var festivalModelDao = require('../model/festivalModelDao');

var commons = require('../util/commons');


module.exports={
    festivalManage:function(){
        app.get('/festival/manage', function (req, res) {
            if(req.session.passport.user.uid == "yoda"){
                res.render('holidayMgmt/festival_manage',{message: req.flash('message'),
                    layout:'layout'});
            }
            else{
                res.render('error',{layout:'layout1'});
                res.redirect('/');
            }
            console.log( req.body.title);
            console.log( req.session. passport.user.displayName);
            console.log( req.url +"   "+  req.method );
            // console.log( req.session. request.methods);

        });
    },
    festivalAdd:function(){
        app.get('/festival/add', function (req, res) {
            if(req.session.passport.user.uid == "yoda"){
                res.render('holidayMgmt/festival_add',{message: req.flash('message'),
                    layout:'layout'});
            }
            else{
                res.render('error',{layout:'layout1'});
                res.redirect('/');
            }
        });
    },

    festivalShow:function(){
        app.get('/festival/show', function (req, res) {
            var user = req.session['passport']['user'];
            commons.layout(user.uid, res,"holidayMgmt/festival_show");
        });
    }
};
var app=require('../app.js');
var commons = require('../util/commons');

module.exports={
    overtimeAdd:function(){
        app.get('/overtime/add', function (req, res) {
            // res.render("holidayMgmt/overtime_add");
            commons.layout(req.session.passport.user.uid, res,"holidayMgmt/overtime_add");
        });
    },
    overtimeShow:function(){
        app.get('/overtime/show', function (req, res) {
            // res.render("holidayMgmt/overtime_show");
            commons.layout(req.session.passport.user.uid, res,"holidayMgmt/overtime_show");
        });
    }
}
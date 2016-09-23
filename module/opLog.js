/**
 * Created by qianxuehong on 2016/9/1.
 */
var app=require('../app.js');

var opLogModelDao = require('../model/opLogModelDao');


module.exports={
    opLogManage:function(){
        app.get('/opLog/manage',function (req, res) {
            // console.log( req.session. passport);
            res.render("holidayMgmt/opLog_manage",{
                // layout:'layout1'
            });
        });
    }
};
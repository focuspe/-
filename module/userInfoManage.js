/**
 * Created by LZY on 2016/8/31.
 */
var app=require('../app.js');

module.exports={
    userInfoManage:function(){
        app.get('/userinfo/manage', function (req, res) {
            res.render("holidayMgmt/userinfo_manage");
        });
    }
}
/**
 * Created by LZY on 2016/8/31.
 */

var userModelDao = require("../model/usersModelDao");

var initUserInfo = function(req, res, next){
    var uid = req.session. passport.user.uid;
    var userDoc = {
        uid: req.session. passport.user.uid ,
        displayName: req.session. passport.user.displayName,
        mail: req.session. passport.user.mail,
        uidNumber: req.session. passport.user.uidNumber,
        belToGid: req.session. passport.user.gidNumber,
        annualLeave: 10,//年假
        sickLeave: 5,//病假
        transferLeave: 0,//调休假
        marriageLeave: 10,//婚假
        maternityLeave: 180,//产假
        bereavementLeave: 3,//丧假
        nursesLeave: 5,//陪护假
        businessLeave:0,//事假
        otherLeave: 0,
        createTime: (new Date()).getTime(),
        isDelete: 0
    };
    userModelDao.findOne({uid:uid},function(err,result){
            if(!err){
                if(!result){
                    userModelDao.create(userDoc,function(err,result){
                        if(!err){
                            next();
                        }
                    })
                }else{
                     next();
                }
            }
    });
}

module.exports = initUserInfo;
/**
 * Created by LZY on 2016/8/30.
 */
var app=require('../app.js');
var overtimeDao = require("../model/overtimeModelDao");
var usersModelDao = require("../model/usersModelDao");

var sendMail = require("./mailApi");

module.exports= {
    overtimeApiAdd: function () {
        app.post('/overtime/api/add', function (req, res) {
            usersModelDao.find({uid:req.session. passport.user.uid},function (err,res_data) {
                if(!err){
                    var doc = {
                        uid:req.session. passport.user.uid,
                        uName:res_data[0].displayName,
                        belToGid: req.session. passport.user.gidNumber,
                        startTime:req.body.startTime,
                        endTime:req.body.endTime,
                        duration:req.body.duration,
                        desc:req.body.desc,
                        status:"审核中",//审核中，通过，未通过
                        createTime:(new Date()).getTime(),
                        isDelete:0
                    }
                    overtimeDao.create(doc,function(err, result){
                        sendMail("luzhaoyuan@daemonrob.com","qing jia","wo yao qing jia");
                        if(!err){
                            res.json({
                                status:1,
                                msg:"插入成功"
                            });
                        }else{
                            res.json({
                                status:0,
                                msg:"插入失败"
                            });
                        }
                    })
                }else{
                    res.json({
                        status:0,
                        msg:"插入失败"
                    });
                }
            })

        });
    },
    overtimeApiGet: function () {
        app.post('/overtime/api/get', function (req, res) {
            var uid = req.session.passport.user.uid;
            var query = {};
            if(uid){
                query["uid"]= uid;
            }
            if(req.body.displayName){
                query["displayName"]= req.body.displayName;
            }
            var limit = parseInt(req.body.pageSize);
            var sort = {uid:'asc'};//正序排列
            var skip = (req.body.pageNo-1)*req.body.pageSize;
            overtimeDao.count(query,function (err1,count) {
               if(!err1)
                   overtimeDao.getPage(query,limit,sort,skip,function(err,result){
                       if(!err){
                           res.json({
                               status:1,
                               data:result,
                               total:count,
                               msg:"查询成功"
                           });
                       }else{
                           res.json({
                               status:0,
                               msg:"查询失败"
                           });
                       }
                   });
            });
        });
    },
};


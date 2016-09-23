/**
 * Created by LZY on 2016/8/31.
 */
var app=require('../app.js');

var usersModelDao = require("../model/usersModelDao");

module.exports={
    userInfoApiGet:function(){
        app.post('/userInfo/api/get', function (req, res) {
            var query = {};
            if(req.body.belToGid){
                query["belToGid"]= req.body.belToGid;
            }
            if(req.body.leadGid){
                query["leadGid"]= req.body.leadGid;
            }
            if(req.body.uid){
                query["uid"]= req.body.uid;
            }
            if(req.body.displayName){
                query["displayName"]= eval("/"+req.body.displayName+"/");
            }
            var limit = parseInt(req.body.pageSize);
            var sort = {uid:'asc'};//正序排列
            var skip = (req.body.pageNo-1)*req.body.pageSize;
            usersModelDao.count(query,function (err1,result1) {
                if(!err1)
                usersModelDao.getPage(query,limit,sort,skip,function (err,result) {
                    console.log(err);
                    if(!err){
                        res.json({
                            status:1,
                            data:result,
                            total:result1,
                            msg:"查询成功"
                        });
                    }else{
                        res.json({
                            status:0,
                            msg:"查询失败"
                        });
                    }
                });
            })
        });
    },
    userInfoApiUpdate:function(){
        app.post('/userInfo/api/update', function (req, res) {
            var userInfo = JSON.parse(req.body.userInfo);
                if(userInfo){
                    usersModelDao.updateById(userInfo._id,userInfo,function (err,result) {
                        if(!err){
                            res.json({
                                status:1,
                                data:result,
                                msg:"更新成功"
                            })
                        }else{
                            res.json({
                                status:0,
                                msg:"更新失败"
                            })
                        }
                    })
                }
        });
    },
}
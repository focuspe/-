var app=require('../app.js');

var opLogModelDao = require('../model/opLogModelDao');


module.exports={
    opLogApiAdd:function(){
        app.post('/opLog/api/add', function (req, res) {
          var doc = {
                // date:req.body.date,
                userName:req.body.userName,
                func:req.body.func,
                req:req.body.req,
                res:req.body.res,
                createTime:(new Date()).getTime()
            };

            opLogModelDao.create(doc, function(err, result){
                
                if(!err){
                    res.json({
                        status:1,
                        msg:"插入成功"
                    });
                    console.log('saved!'); 
                }else{
                     res.json({
                        status:0,
                        msg:"插入失败"
                    });
                    console.log(err);
                }
				
            });
        });
    },

    opLogApiGet:function() {
         app.post('/opLog/api/get', function (req, res) {
             var query = {};
             if (req.body.userName){
                 query["userName"] = req.body.userName;
                 console.log('-----------');
                 console.log(req.body.userName);
             }
             if (req.body.startTime && req.body.endTime){
                 query["createTime"]={
                     "$gte":req.body.startTime,
                     "$lte":req.body.endTime
                 }
             }
             var limit = parseInt(req.body.pageSize);
             var sort = {createTime:-1};//按时间排序
             var skip = (req.body.pageNo-1)*req.body.pageSize;
            opLogModelDao.count(query,function(err1,result1){
                if(!err1)
                    opLogModelDao.getPage(query,limit,sort,skip,function (err, result) {
                        console.log(err);
                        if (!err) {
                            res.json({
                                status: 1,
                                data: result,
                                total: result1,
                                msg: "查询成功"
                            });
                        } else {
                            res.json({
                                status: 0,
                                msg: "查询失败"
                            });
                        }
                    });
                })
         });
    },

    opLogApiAddTest:function(){
        app.get('/opLog/api/addTest', function (req, res) {
          var doc = {
                date:"2016-2-1",
                userName:"qianxuehong",
                func:"festivalApi",
                req:"小迪公司活动",
                res:"调用成功",
                createTime:(new Date()).getTime()
            };
//将所有记录删除，用于测试添加用户请求log
            opLogModelDao.deleteAll( function(err, result){
                if(!err){
                    res.json({
                        status:1,
                        msg:"插入成功"
                    });
                    console.log('saved!');
                }else{
                    res.json({
                        status:0,
                        msg:"插入失败"
                    });
                    console.log(err);
                }
            });
        });
    }
};
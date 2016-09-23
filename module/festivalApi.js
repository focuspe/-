var app=require('../app.js');

var festivalModelDao = require('../model/festivalModelDao');

var SaveLogToDB = require('../util/SaveLogToDB');
var config = require('../config.json');
var excelExport = require('../util/excelExport');
var async = require('async');

function exportDataToExel(req, data) {
    var conf ={};
    var sessionUid = req.session['passport']['user']['uid'];
    conf.cols = [
        {caption:'日期', type:'date', key:"date"},
        {caption:'标题', type:'string', key:"title"},
        {caption:'类型', type:'number', key:"type"},
        {caption:'说明', type:'number', key:"comments"}
    ];
    conf.rows = data || [];
    var filename =config.excel_file.festivalExport +sessionUid+ config.excel_file.extension_name;
    excelExport.createExcel({
        data:conf,
        filename:filename,
        cb:function(error, path){
            console.log("exec export fail",error);
        }
    });
}


module.exports={
    festivalApiAdd:function(){
        app.post('/festival/api/add', function (req, res) {
          var doc = {
                date:req.body.date,
                title:req.body.title,
                type:req.body.type,
                comments:req.body.comments,
                createTime:(new Date()).getTime(),
                updateTime:(new Date()).getTime(),
                isDelete:req.body.isDelete
            };
            console.log(doc);

            festivalModelDao.create(doc, function(err, result){
                SaveLogToDB.saveHttpLog(req,result);

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
                    })
                    console.log(err);
                }
				
            });
        });
    },

    festivalApiGet: {
        post:function() {
            app.post('/festival/api/get', function (req, res) {
                var query=[];
                var limit = parseInt(req.body.pageSize);
                var sort = {date:-1};//按时间排序
                var skip = (req.body.pageNo-1)*req.body.pageSize;
                query["isDelete"]=false;
                festivalModelDao.count(query, function (err1, reslut1) {
                    if(!err1) {
                        festivalModelDao.getPage(query,limit, sort, skip,function(err,result){
                            SaveLogToDB.saveHttpLog(req,result);
                            if(!err){
                                res.json({
                                    status:1,
                                    data:result,
                                    total:reslut1,
                                    msg:"查询成功"
                                });
                                exportDataToExel(req, result);
                            }else{
                                res.json({
                                    status:0,
                                    msg:"查询失败"
                                });
                            }
                        });
                    }
                })

            })
        },
         
        get:function() {
            app.get('/festival/api/get', function (req, res) {
                festivalModelDao.find({isDelete:false},function(err,result){
                    SaveLogToDB.saveHttpLog(req,result);
                    if(!err){
                        var data = [];
                        for(var i=0;i<result.length;i++){
                            var color="#ff0000";
                            if(result[i].type==1)
                                color="#00ff00";
                            var item={
                                title: result[i].title,
                                start: new Date(result[i].date+8*3600*1000),
                                allDay: true,
                                textColor: color
                            };
                            data.push(item);
                        }
                        res.json(data);
                    }else{
                        var data = [];
                        res.json(data);
                    }
                });
           
            });
        }

    },

    festivalApiDel:function() {
         app.post('/festival/api/del', function (req, res) {
            festivalModelDao.deleteAll({},function(err,result){
                SaveLogToDB.saveHttpLog(req,result);
                if(!err){
                    res.json({
                        status:1,
                        data:result,
                        msg:"清除成功"
                    });
                }else{
                    res.json({
                        status:0,
                        msg:"清除失败"
                    });
                }
            });
        });
    },


    festivalApiAddTest:function(){
        app.get('/festival/api/addTest', function (req, res) {
          var doc = {
                date:"2016-2-1",
                title:"公司活动",
                type:1,
                comments:"小迪公司活动",
                createTime:(new Date()).getTime(),
                updateTime:(new Date()).getTime(),
                isDelete:0
            }

            festivalModelDao.create(doc, function(err, result){
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
                    })
                    console.log(err);
                }
            });
        });
    },
}
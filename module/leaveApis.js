/**
 * Created by LZY on 2016/8/1.
 */
var app=require('../app.js');
var usersModuleDao = require('../model/usersModelDao');
var leaveRecordModuleDao = require('../model/leaveRecordsModelDao');
var async = require('async');
var config = require('../config.json');
var excelExport = require('../util/excelExport');
var mailApi = require('./mailApi');
var saveLogToDB = require('../util/SaveLogToDB');
var WORK_TIME = {
  AM:"9:00-12:00",
  PM:"13:00-18:00"
};
const TAG = "leaveApis";

/**
 * 发送邮件给上级
 * @param userinfo      当前用户信息
 */
function mailToSuperiors(uid, gid) {
    //step1:获取上级的用户信息
    var belToGid = gid;
    if (!belToGid) {
        console.log(TAG,"The employee has no superior leadership。");
        return;
    }
    var query = {
        $or:[
            {uid:uid},
            {leadGid:gid}
        ]
    };
    usersModuleDao.find(query,function (error, result) {
        var leaderUserInfo , ownUserInfo;
        for (var i=0;i<result.length;i++) {
            var userInfo = result[i]['_doc'];
            if (userInfo['uid'] === uid) {
                ownUserInfo = userInfo;
            }
            if (userInfo['leadGid'] === gid) {
                leaderUserInfo = userInfo;
            }
        }
        if (error || !leaderUserInfo || !ownUserInfo) {
            console.log(TAG,"The employee has no superior leadership。");
            return;
        }
        //step2:替换模板中的数据
        var subject = config.email_template.leave_add.subject;
        var content = config.email_template.leave_add.content;
        var emailAddr = leaderUserInfo['mail'];
        //for test
        subject = subject.replace("staffUserName",ownUserInfo['displayName']);
        content = content.replace("staffUserName",ownUserInfo['displayName']);
        content = content.replace("leaderUserName",leaderUserInfo['displayName']);

        //step3:发送邮件
        mailApi(emailAddr, subject, content);
    });
}

/**
 * 领导批准请假单之后，通知员工
 */
function mailToEmployees(leaderUserInfo, uid) {
    usersModuleDao.findOne({uid:uid}, function (error, result) {
        var employeesUserInfo = result['_doc'];
        if (!employeesUserInfo) {
            console.log("Employee information is null.");
            return;
        }
        //step2:替换模板中的数据
        var subject = config.email_template.leave_agree.subject;
        var content = config.email_template.leave_agree.content;
        var emailAddr = employeesUserInfo['mail'];
        //for test
        subject = subject.replace("leaderUserName",leaderUserInfo['displayName']);
        content = content.replace("staffUserName",employeesUserInfo['displayName']);
        content = content.replace("leaderUserName",leaderUserInfo['displayName']);

        //step3:发送邮件
        mailApi(emailAddr, subject, content);
    })
}

function getAvailableLeaves(req, res) {
    var sessionUid,belToGid;
    sessionUid = req.session['passport']['user']['uid'];
    belToGid = req.session['passport']['user']['gidNumber'];
    function exportDataToExel(data) {
        var conf ={};
        conf.cols = [
            {caption:'uid', type:'string', key:"uid"},
            {caption:'姓名', type:'string', key:"displayName"},
            {caption:'mail', type:'string', key:"mail"},
            {caption:'年假（小时）', type:'number', key:"annualLeave"},
            {caption:'病假（小时）', type:'number', key:"sickLeave"},
            {caption:'事假（小时）', type:'number', key:"businessLeave"},
            {caption:'调休假（小时）', type:'number', key:"transferLeave"},
            {caption:'婚假（小时）', type:'number', key:"marriageLeave"},
            {caption:'产假（小时）', type:'number', key:"maternityLeave"},
            {caption:'丧假（小时）', type:'number', key:"bereavementLeave"},
            {caption:'陪护假（小时）', type:'number', key:"nursesLeave"},
            {caption:'其它假（小时）', type:'number', key:"otherLeave"}
        ];
        conf.rows = data || [];
        var filename =config.excel_file.availableLeaves + sessionUid + config.excel_file.extension_name;
        excelExport.createExcel({
            data:conf,
            filename:filename,
            cb:function(error, path){
                console.log("exec export fail",error);
            }
        });
    }
    //TODO:根据分组归属查询信息
    usersModuleDao.getAll(function (error, result) {
        saveLogToDB.saveHttpLog(req,JSON.stringify(result));
        if(!error){
            var dataArr = [];
            for (var i=0;i<result.length; i++) {
                var model = result[i];
                dataArr[i] = model['_doc'];
            }
            res.json({
                status:1,
                data:dataArr,
                msg:"查询成功"
            });
            exportDataToExel(dataArr);
        }else{
            res.json({
                status:0,
                msg:"查询失败"
            });
        }
    });
}

function getSelfUserInfo(req, res) {
    var sessionUid;
    sessionUid = req.session['passport']['user']['uid'];
    if (sessionUid) {
        var query = {
            uid:sessionUid
        };
        usersModuleDao.findOne(query, function (error, result) {
            saveLogToDB.saveHttpLog(req, JSON.stringify(result));
            if (!error) {
                var userInfo = result['_doc'];
                console.info(JSON.stringify(userInfo));
                res.json({
                    status:1,
                    data:userInfo,
                    msg:"查询成功"
                });
            } else {
                res.json({
                    status:0,
                    msg:"查询失败"
                });
            }
        });
    } else {
        var errRes = {
            status:0,
            msg:"查询失败"
        };
        saveLogToDB.saveHttpLog(req, JSON.stringify(errRes));
        res.json(errRes);
    }
}

function addLeaveInfo(req, res) {
    var leaveInfo = req.body;
    console.log("leave info:" + JSON.stringify(leaveInfo));
    if (!leaveInfo) {
        var errRes = {
            status:0,
            msg:"创建请假单失败"
        };
        saveLogToDB.saveHttpLog(req, JSON.stringify(errRes));
        return res.json(errRes);
    }
    //检查条件1：beginTime时间必须小于于endTime
    //检查条件2：endTime-beginTime必须大于0.5小时
    //检查条件3：beginTime必须大于当前时间
    if (!leaveInfo['beginTime']
        || !leaveInfo['endTime']
        || ((leaveInfo['endTime'] - leaveInfo['beginTime'])< (0.5*60*60*1000))
        || (leaveInfo['beginTime'] <= (new Date()).getTime())) {
        var errRes1 = {
            status:0,
            msg:"创建请假单失败,请选择正确的请假时间。"
        };
        saveLogToDB.saveHttpLog(req, JSON.stringify(errRes1));
        return res.json(errRes1);
    }
    leaveInfo['status'] = "审批中";//审核中，通过，未通过
    leaveInfo['duration'] = getWorkTime(leaveInfo['beginTime'], leaveInfo['endTime']);
    leaveInfo['createTime'] = leaveInfo['updateTime'] = new Date().getTime();
    console.log("leave info:" + JSON.stringify(leaveInfo));
    leaveRecordModuleDao.create(leaveInfo, function (error, result) {
        saveLogToDB.saveHttpLog(req, JSON.stringify(result));
        if (!error) {
            res.json({
                status:1,
                msg:"创建请假单成功，请等待领导审批。"
            });
            var userInfo = req.session['passport']['user'];
            return mailToSuperiors(userInfo['uid'], userInfo['gidNumber']);
        } else {
            return res.json({
                status:0,
                msg:"创建请假单失败，请尝试重试。"
            })
        }
    })
}

function getLeavesList(req, res) {
    //TODO:
    var uid = req.session['passport']['user']['uid'];
    var leadGid;
    var queryUser1 = {
        uid:uid
    };
    usersModuleDao.findOne(queryUser1, function (error, result) {
        if (!error && result) {
            var selfUser = result['_doc'];
            var leadGid = selfUser['leadGid'];
            var belToGid = selfUser['belToGid'];
            var query1 = {
                $or:[
                    {uid:uid},
                    {belToGid:leadGid},
                    {leadGid:belToGid}
                ]
            };
            var query2 = {
                $or:[
                    {uid:uid},
                    {belToGid:leadGid}
                ]
            };
            function loadUserList(cb) {
                usersModuleDao.find(query1, function (error, result1) {
                    cb(error, result1);
                });
            }
            function loadLeaves(cb) {
                leaveRecordModuleDao.find(query2, function (error, result2) {
                    cb(error, result2);
                });
            }
            async.parallel([loadUserList,loadLeaves],function (error, values) {
                if (!error && values) {
                    console.log("values:" + values);
                    var leaveList = [];
                    for (var i=0;i<values[1].length;i++) {
                        var leave = values[1][i]['_doc'];
                        for (var j=0;j<values[0].length;j++) {
                            var user = values[0][j]['_doc'];
                            if (leave['uid'] === user['uid']) {
                                leave['displayName'] = (user['displayName']?user['displayName']:leave['uid']);
                            }
                            if (leave['belToGid'] === user['leadGid']) {
                                leave['approver'] = user['displayName'];
                            }
                        }
                        if (!leave['approver']) {
                            leave['approver'] = selfUser['displayName'];
                        }
                        leave['operate'] = (uid === leave['uid'])?false:true;//0代表不可操作，1代表可以审批
                        if (leave['operate']) {
                            leave['operate'] = (leave['status'] === "审批中");
                        }
                        leaveList.push(leave);
                    }
                    saveLogToDB.saveHttpLog(req, JSON.stringify(leaveList));
                    return res.json({
                        status:1,
                        data:leaveList,
                        msg:"查询成功"
                    });
                } else {
                    var errRes2 = {
                        status:0,
                        msg:"数据获取失败，请重新登录尝试"
                    };
                    saveLogToDB.saveHttpLog(req, JSON.stringify(errRes2));
                    return res.json(errRes2);
                }
            });
        } else {
            var errRes3 = {
                status:0,
                msg:"数据获取失败，请重新登录尝试"
            };
            saveLogToDB.saveHttpLog(req, JSON.stringify(errRes3));
            return res.json(errRes3);
        }
    })
}

function processingLeave(req, res) {
    var uid = req.session['passport']['user']['uid'];
    var _id = req.body['_id'];
    var agree = req.body['agree'];
    function updateLeaveDb(leave, userInfo) {
        leave['status'] = (agree === "true")?"通过":"未通过";
        leave['updateTime'] = new Date().getTime();
        leaveRecordModuleDao.updateById(_id,leave,function (error, result) {
            saveLogToDB.saveHttpLog(req, JSON.stringify(result));
            if (!error) {
                res.json({
                    status:1,
                    msg:"已审批。"
                });
                return  mailToEmployees(userInfo, leave['uid']);
            } else {
                return res.json({
                    status:0,
                    msg:"审批失败，请稍后重试。"
                });
            }
        })
    }
    function getSelfUserInfo(cb) {
        usersModuleDao.findOne({uid:uid},function (error, result) {
            cb(error, result);
        })
    }
    function getLeaveInfo(cb) {
        leaveRecordModuleDao.findOne({_id:_id},function (error, result) {
            cb(error, result);
        })
    }
    async.parallel([getSelfUserInfo,getLeaveInfo],function (error, values) {
        if (!error) {
            var userInfo = values[0]['_doc'];
            var leaveInfo = values[1]['_doc'];
            if (!userInfo || !leaveInfo) {
                return res.json({
                    status:0,
                    msg:"审批失败，请稍后重试。"
                });
            }
            //权限检查，如果不是领导则无法审批
            if (userInfo['leadGid'] === leaveInfo['belToGid']) {
                updateLeaveDb(leaveInfo, userInfo);
            } else {
                return res.json({
                    status:0,
                    msg:"您无权审批该请假单。"
                });
            }
        } else {
            return res.json({
                status:0,
                msg:"审批失败，请稍后重试。"
            });
        }
    });
}

function getWorkTime(beginTime, endTime) {
    var durationHours = 0;
    var duration = endTime - beginTime;
    if (duration < 0) {
        return durationHours;
    }
    const ONE_DAY = 24 * 60 * 60 * 1000;//计算出请假的天数
    var days = duration/ONE_DAY;
    durationHours = days * 8;
    var  workAMAry = WORK_TIME.AM.replace('-',":").split(':');
    var  workPMAry = WORK_TIME.PM.replace('-',":").split(':');
    var beginTs = beginTime + days * ONE_DAY;//计算小于1天的小时数
    var amWorkTime = new Date(beginTs);
    var amFreeTime = new Date(beginTs);
    var pmWorkTime = new Date(beginTs);
    var pmFreeTime = new Date(beginTs);
    amWorkTime.setHours(workAMAry[0],workAMAry[1],0,0);
    amFreeTime.setHours(workAMAry[2],workAMAry[3],0,0);
    pmWorkTime.setHours(workPMAry[0],workPMAry[1],0,0);
    pmFreeTime.setHours(workPMAry[2],workPMAry[3],0,0);
    var amWorkTs = amWorkTime.getTime();
    var amFreeTs = amFreeTime.getTime();
    var pmWorkTs = pmWorkTime.getTime();
    var pmFreeTs = pmFreeTime.getTime();
    var amTime = 0;//单位：毫秒
    var pmTime = 0;//单位：毫秒
    if (beginTs <= amWorkTs) {
        amTime = 3 * 60 * 60 * 1000;
    } else if (beginTs>amWorkTs && beginTs<amFreeTs) {
        amTime = amFreeTs - beginTs;
    }
    if (beginTs<pmWorkTs && endTime >= pmFreeTs) {
        pmTime = 5 * 60 * 60 * 1000;
    } else if (beginTs<pmWorkTs && endTime < pmFreeTs) {
        pmTime = pmFreeTs -  ((pmWorkTs > endTime)?pmWorkTs:endTime);
    } else if (beginTs>pmWorkTs && beginTs < pmFreeTs) {
        pmTime = pmFreeTs -  ((endTime<pmFreeTs)?endTime:pmFreeTs);
    }
    durationHours = durationHours + (amTime + pmTime)/(60 * 60 * 1000);
    console.log("work time:" + durationHours + "小时，time" + new Date(beginTime) + "到" + new Date(endTime));
    return durationHours
}

module.exports={
    getAvailableLeaves:{
        post:function(){
            app.post('/leave/api/getAvailableLeaves',  function (req, res) {
                var user = req.session['passport']['user'];
                getAvailableLeaves(req, res);
            });
        },
        get:function(){
            app.get('/leave/api/getAvailableLeaves', function (req, res) {
                var user = req.session['passport']['user'];
                getAvailableLeaves(req, res);
            });
        }
    },
    getSelfUserInfo: {
        post: function () {
            app.post('/leave/api/getSelfUserInfo', function (req, res) {
                var user = req.session['passport']['user'];
                getSelfUserInfo(req, res);
            });
        },
        get: function () {
            app.get('/leave/api/getSelfUserInfo', function (req, res) {
                var user = req.session['passport']['user'];
                getSelfUserInfo(req, res);
            });
        }
    },
    addLeaveInfo: {
        post: function () {
            app.post('/leave/api/addLeaveInfo', function (req, res) {
                var user = req.session['passport']['user'];
                addLeaveInfo(req, res);
            });
        },
        get: function () {
            app.get('/leave/api/addLeaveInfo', function (req, res) {
                var user = req.session['passport']['user'];
                addLeaveInfo(req, res);
            });
        }
    },
    getLeavesList: {
        post: function () {
            app.post('/leave/api/getLeavesList', function (req, res) {
                var user = req.session['passport']['user'];
                getLeavesList(req, res);
            });
        },
        get: function () {
            app.get('/leave/api/getLeavesList', function (req, res) {
                var user = req.session['passport']['user'];
                getLeavesList(req, res);
            });
        }
    },
    processingLeave: {
        post: function () {
            app.post('/leave/api/processingLeave', function (req, res) {
                var user = req.session['passport']['user'];
                processingLeave(req, res);
            });
        },
        get: function () {
            app.get('/leave/api/processingLeave', function (req, res) {
                var user = req.session['passport']['user'];
                processingLeave(req, res);
            });
        }
    }
};
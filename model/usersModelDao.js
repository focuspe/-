var mongoose = require('mongoose');
var MongooseDao = require("./mongooseDao.js");

var thisModelName = "users";
var thisSchema = new mongoose.Schema({
    uid: String ,
    displayName: String,
    uidNumber:String,
    mail: String,
    department:String,//部门
    userName:String,//姓名
    cardId:String,//证件号码
    gender:String,//性别
    age:Number,//年龄
    householdProperty:String,//户籍性质
    maritalStatus:String,//婚姻状况
    education:String,//学历
    entryDate:String,//入职日期
    post:String,//职务
    ourAge:Number,//司龄
    employeeNature:String,//员工性质
    inServiceState:String,//在职状态
    belToGid: String,
    leadGid: String,
    annualLeave: Number,//年假
    sickLeave: Number,//病假
    businessLeave:Number,//事假
    transferLeave: Number,//调休假
    marriageLeave: Number,//婚假
    maternityLeave: Number,//产假
    bereavementLeave: Number,//丧假
    nursesLeave: Number,//陪护假
    otherLeave: Number,
    annualLeaveUsed: Number,//已用年假
    sickLeaveUsed: Number,//已用病假
    businessLeaveUsed:Number,//事假
    transferLeaveUsed: Number,//已用调休假
    marriageLeaveUsed: Number,//已用婚假
    maternityLeaveUsed: Number,//已用产假
    bereavementLeaveUsed: Number,//已用丧假
    nursesLeaveUsed: Number,//已用陪护假
    otherLeaveUsed: Number,
    desc:String,//备注
    createTime: Number,
    updateTime: Number,
    isDelete: Number
});

thisSchema.methods.is_exist = function(callback) {
    var query = {};
    query["_id"] = this["_id"];
    return this.model(thisModelName).findOne(query, callback);
};

thisSchema.methods.logical_delete = function(uid, callback) {};

thisSchema.statics.delete_by_name = function(name, callback_succ, callback_fail) {};

var thisModel = mongoose.model(thisModelName, thisSchema ,thisModelName);//若第三个参数不填,则对应到mongodb中的collection名会自动加上's'

var thisDao = new MongooseDao(thisModel);

module.exports = thisDao;
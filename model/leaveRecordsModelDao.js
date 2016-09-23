var mongoose = require('mongoose');
var MongooseDao = require("./mongooseDao.js");

var thisModelName = "leave_records";
var thisSchema = new mongoose.Schema({
    uid: String ,
    belToGid: String,
    leadGid: String,
    beginTime: Number,
    endTime: Number,
    duration: Number,//请假时间，单位毫秒
    type: Number,
    status: String,//审核中，通过，未通过
    desc: String,
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
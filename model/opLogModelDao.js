/**
 * Created by Aaron WEI on 16/1/12.
 * 参考文档--Mongoose学习参考文档——基础篇: https://cnodejs.org/topic/504b4924e2b84515770103dd
 */
var mongoose = require('mongoose');
var MongooseDao = require("./mongooseDao.js");


var thisModelName = "opLog";
var thisSchema = new mongoose.Schema({
    // date: Number,
    userName: String,
    API: String,
    req: String,
	res: String,
    createTime: Number
});

thisSchema.methods.is_exist = function(callback) {
    var query = {};
    query["_id"] = this["_id"];
    return this.model(thisModelName).findOne(query, callback);
};

thisSchema.statics.delete_by_name = function(name, callback_succ, callback_fail) {};

var thisModel = mongoose.model(thisModelName, thisSchema ,thisModelName);//若第三个参数不填,则对应到mongodb中的collection名会自动加上's'

var thisDao = new MongooseDao(thisModel);


module.exports = thisDao;


var mongoose = require('mongoose');
var MongooseDao = require("./mongooseDao.js");

var thisModelName = "overtime";
var thisSchema = new mongoose.Schema({
    uid:String,
    uName:String,
    belToGid: String,
    leadGid: String,
    startTime:Number,
    endTime:Number,
    duration:String,
    desc:String,
    status:String,//审核中，通过，未通过
    createTime:Number,
    updateTime:Number,
    isDelete:Number
});

thisSchema.methods.is_exist = function(callback) {
    var query = {};
    query["_id"] = this["_id"];
    return this.model(thisModelName).findOne(query, callback);
};

thisSchema.methods.logical_delete = function(callback) {
    this.model(thisModelName).updateById(this._id, {
        active: false
    }, function(err, result){
    });
};

thisSchema.statics.delete_by_name = function(name, callback_succ, callback_fail) {};

var thisModel = mongoose.model(thisModelName, thisSchema ,thisModelName);//若第三个参数不填,则对应到mongodb中的collection名会自动加上's'

var thisDao = new MongooseDao(thisModel);

module.exports = thisDao;
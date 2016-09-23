/**
 * 参考文档--Mongoose学习参考文档——基础篇: https://cnodejs.org/topic/504b4924e2b84515770103dd
 */
var mongoose = require('mongoose');
var MongooseDao = require("./mongooseDao.js");


var thisModelName = "example";
var thisSchema = new mongoose.Schema({
    name: String,
    binary: Buffer,
    living: Boolean,    
    updated: Date,
    age: Number,
    mixed: Schema.Types.Mixed, //该混合类型等同于nested
    _id: Schema.Types.ObjectId,  //主键
    _fk: Schema.Types.ObjectId,  //外键
    array: [],
    arrOfString: [String],
    arrOfNumber: [Number],
    arrOfDate: [Date],
    arrOfBuffer: [Buffer],
    arrOfBoolean: [Boolean],
    arrOfMixed: [Schema.Types.Mixed],
    arrOfObjectId: [Schema.Types.ObjectId],
    nested: {
        stuff: String,
    }
});

/*thisSchema.methods.find_by_custom_id = function(callback) {
 var query = {};
 query[thisModelCustomId] = this[thisModelCustomId];
 return this.model(thisModelName).find(query, callback);
 };*/

/*thisSchema.methods.is_exist = function(callback) {
 var query = {};
 query[thisModelCustomId] = this[thisModelCustomId];
 return this.model(thisModelName).findOne(query, callback);
 };*/

thisSchema.methods.is_exist = function(callback) {
    var query = {};
    query["_id"] = this["_id"];
    return this.model(thisModelName).findOne(query, callback);
};

thisSchema.statics.delete_by_name = function(name, callback_succ, callback_fail) {};

var thisModel = mongoose.model(thisModelName, thisSchema ,thisModelName);//若第三个参数不填,则对应到mongodb中的collection名会自动加上's'

var thisDao = new MongooseDao(thisModel);

module.exports = thisDao;


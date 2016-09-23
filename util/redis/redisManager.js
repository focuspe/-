/********************************************************************************
 * Copyright (c) 2016.04 XiaoDi (Shanghai) Information Technologies Co. Ltd.
 * All rights reserved.
 ********************************************************************************/

/**
 * Created by Scott on 2016/6/13.
 * 该类负责redis的登录存储和管理
 */

var Redis = require('ioredis');
var redisCofig = require('../../config.json').redis;

var redis;

//定义常用的key前缀
var REDIS_CONS = {
};

function RedisManager() {
  redis = new Redis({
    port:redisCofig.port,
    host:redisCofig.host,
    password:redisCofig.password,
    connectionName:redisCofig.connectionName,
    db:redisCofig.db
  });
}

/**
 * 获取redis实例
 * @returns {*} 返回redis对象
 */
RedisManager.prototype.getRedis = function() {
  return redis;
};

/**
 * Redis保存数据，带有效期限
 * @param key            保存数据的Key
 * @param value          保存数据的值
 * @param callback       保存结果回调函数
 */
RedisManager.prototype.set = function(key,value,callback) {
  if (!key) {
    callback(["The Key is null",""]);
    return;
  }
  var promise = redis.pipeline().set(key,value).exec();
  promise.then(callback);
  return promise;
};

/**
 * 用Redis保存数据并且带时间期限
 * @param key            保存数据的Key
 * @param value          保存数据的值
 * @param expire         数据保存的期限
 * @param callback       保存结果回调函数
 */
RedisManager.prototype.setWithExpire = function(key,value,expire,callback) {
  if (!key) {
    callback([["The Key is null",null],["The Key is null",null]]);
    return;
  }
  var promise = redis.pipeline().set(key,value).expire(key,expire).exec();
  promise.then(callback);
  return promise;
};

/**
 * 给指定的redis数据设定期限
 * @param key
 * @param expire
 * @param callback
 */
RedisManager.prototype.setExpire = function(key,expire,callback) {
  if (!key) {
    callback(["The Key is null",null]);
    return;
  }
  var promise = redis.pipeline().expire(key,expire).exec();
  promise.then(callback);
  return promise;
};

/**
 * 从redis数据库中读取数据
 * @param key            保存数据的Key
 * @param callback       从数据库中读取数据后的回调函数
 */
RedisManager.prototype.get = function(key,callback) {
  if (!key) {
    callback(["The Key is null",null]);
    return;
  }
  var promise = redis.pipeline().get(key).exec();
  promise.then(callback);
  return promise;
};

/**
 * 调用该方法删除redis的一条数据
 * @param key            保存数据的Key
 * @param callback       从数据库中读取数据后的回调函数
 */
RedisManager.prototype.del = function(key,callback) {
  if (!key) {
    callback(["The Key is null",null]);
    return;
  }
  var promise = redis.pipeline().del(key).exec();
  promise.then(callback);
  return promise;
};

/**
 * 该函数提供存储map键值对
 * @param hmsetKey        hmset的key
 * @param keysValues      需要保存的value值，格式为：{key1:value1,key2:value2}
 * @param callback        设置完成后的回调函数
 */
RedisManager.prototype.hmset = function (hmsetKey, keysValues, callback) {
  var promise = redis.pipeline().hmset(hmsetKey,keysValues).exec();
  promise.then(callback).fail(callback);
  return promise;
};

/**
 * 该函数提供读取redis的集合setKey中key为itemKey的item的值
 * @param setKey        redis的set解和的key
 * @param itemKey       要读取的值的key
 * @param callback      从redis读取数据后通过该回调函数返回读取结果
 */
RedisManager.prototype.hmget = function (setKey, itemKey, callback) {
  var promise = redis.pipeline().hmget(setKey,itemKey).exec();
  promise.then(callback).fail(callback);
  return promise;
};

/**
 * 该函数提供从redis中读取集合setKey的所有值的功能
 * @param setKey          redis中set集合的key
 * @param callback        结果回调函数
 */
RedisManager.prototype.hgetall = function (setKey, callback) {
  var promise = redis.pipeline().hgetall(setKey).exec();
  promise.then(callback).fail(callback);
  return promise;
};
/* --------------------------------------------------------------------------------------------------------------------- */
// RedisManager.prototype.getUserAccessToken = function (uid, callback) {
//   return this.get(REDIS_CONS.ACCESS_TOKEN_ + uid, callback)
// };

module.exports = new RedisManager();
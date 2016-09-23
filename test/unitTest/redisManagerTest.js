/********************************************************************************
 * Copyright (c) 2016.04 XiaoDi (Shanghai) Information Technologies Co. Ltd.
 * All rights reserved.
 ********************************************************************************/

/**
 * Created by Scott on 2016/6/13.
 * Redis 单元测试类
 */
var should = require('should'),
    redisManager = require('../../util/redis/redisManager');
var TAG = "redisTest";
describe('redisManager',function () {
  describe('#getRedis', function () {
    it("should return redis object when the getRedis is called.",function (done) {
      var redisClient = redisManager.getRedis();
      redisClient.should.be.an.instanceOf(Object);
      done();
    });
  });
  describe('#set', function () {
    it("should return ok when the key is executed successfully.",function (done) {
      redisManager.set('keyset1','2016-06-16',function (result) {
        console.log(TAG,"set result:" + result);
        result[0][1].should.equal('OK');
        redisManager.del('keyset1');
        done();
      });
    });
 });
  describe('#setWithExpire', function () {
    it("should return 1 when expire's key is set to succeed.",function (done) {
      redisManager.setWithExpire('setWithExpire','2016-06-16',1200,function (result) {
        console.log(TAG,"setWithExpire result:" + result);
        result[0][1].should.equal('OK');
        result[1][1].should.equal(1);
        redisManager.del('setWithExpire');
        done();
      });
    });
  });
  describe('#setExpire', function () {
    it("should return ok when the key is executed successfully.",function (done) {
      redisManager.set('setExpire','2016-06-16',function (result) {
        console.log(TAG,"setExpire.set result:" + result);
        result[0][1].should.equal('OK');
        done();
      });
    });
    it("should return 1 when the key is set for a period of time.",function (done) {
      redisManager.setExpire('setExpire',1200,function (result) {
        console.log(TAG,"setExpire result:" + result);
        result[0][1].should.equal(1);
        redisManager.del('setExpire');
        done();
      });
    });
  });
  describe('#get', function () {
    it("should return ok when set key is executed successfully.",function (done) {
      redisManager.set('getValue','2016-06-16',function (result) {
        console.log(TAG,"getValue.set result:" + result);
        result[0][1].should.equal('OK');
        done();
      });
    });
    it("should return non null values when get the key success.",function (done) {
      redisManager.get('getValue',function (result) {
        console.log(TAG,"getValue result:" + result);
        result[0][1].should.equal('2016-06-16');
        redisManager.del('getValue');
        done();
      });
    });
  });
  describe('#del', function () {
    it("should return ok when set key is executed successfully.",function (done) {
      redisManager.set('delValue','2016-06-16',function (result) {
        console.log(TAG,"delValue.set result:" + result);
        result[0][1].should.equal('OK');
        done();
      });
    });
    it("should return ok values when get the key success.",function (done) {
      redisManager.del('delValue',function (result) {
        console.log(TAG,"delValue result:" + result);
        result[0][1].should.equal(1);
        done();
      });
    });
  });
});

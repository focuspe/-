
/*** 该类用于记录HTTP请求日志*/

var opLogModelDao = require('../model/opLogModelDao');


function HttpLogger() {
}

/**
 * 调用该接口可以保存http请求日志
 * @param req       {request}
 * @param resResult {String}
 */
HttpLogger.prototype.saveHttpLog = function (req, result) {
    var resObj = {
    };


    //数据采集
        resObj.userName = req.session. passport.user.displayName;
        resObj.API = req.url;
        resObj.req = req.method;
        resObj.res = result;
        resObj.createTime = (new Date()).getTime();

    saveHttpLogToDB(resObj);
};


function saveHttpLogToDB(resObj) {
    opLogModelDao.create(resObj, function(err, result){
        if(!err)
            console.log('saved!');
    });

}

module.exports = new HttpLogger();

/********************************************************************************
 * Copyright (c) 2016.04 XiaoDi (Shanghai) Information Technologies Co. Ltd.
 * All rights reserved.
 ********************************************************************************/

/**
 * Created by Scott on 2016/9/5.
 * Excel 文件导出和下载
 */
var extend = require("extend");
var fs = require("fs");
var excelExport = require('excel-export');
var guid = require('../util/getUuid');
var path = require('path');
var commons = require('./commons');
var config = require('../config.json');
var excel = function () {
    this.req = null;
    this.resp = null;
};

/**
 *
 * @param cols  {Array}     such as:[{caption:'string', type:'string', key:"title"}}
 * @param rows  {Array}     such as:[{caption:'string', type:'string', key:"title"}}
 */
function parseData(cols, rows) {
    var data = [];
    for (var i=0;i<rows.length;i++) {
        var item = [];
        var colsSize = cols.length;
        for (var j=0;j<colsSize;j++) {
            var type = cols[j]['type'];
            var key = cols[j]['key'];
            var value = rows[i][key];
            if (!value) {
                if (type === 'string') {
                    value = "";
                } else if (type === 'bool') {
                    value = false;
                } else if (type === 'number'){
                    value = 0;
                } else {
                    value = "";
                }
            }
            if (type === 'date') {
                value = commons.format(value, "yyyy-MM-dd HH:mm:ss");
            }
            item.push(value);
        }
        data.push(item);
    }
    return data;
}
/**
 * 生成excel文件
 * @param option {object}
 */
excel.prototype.createExcel = function (option) {
    var setting = {savePath: config.excel_file.filePath};
    setting = extend({}, setting, option);
    var uuid = guid;
    option.data.rows = parseData(option.data.cols, option.data.rows);
    //更改date类型为String，否则日期显示会不正确
    for (var i=0;i<option.data.cols.length;i++) {
        if (option.data.cols[i]['type'] === 'date') {
            option.data.cols[i]['type'] = 'string';
        }
    }
    var data = option.data;
    var result = excelExport.execute(data);
    var name = option.filename || ('excel' + uuid + '.xlsx');
    fs.mkdir(setting.savePath, '0755', function (err) {
        if (!err || err['code'] === 'EEXIST') {
            var filePath = path.resolve(setting.savePath, name);
            console.log("filePath:",filePath);
            fs.writeFile(filePath, result, 'binary', function (err) {
                setting.cb(err, filePath);
            });
        } else {
            console.log("The direction create fail, error:", err);
        }
    });

};
/**
 * 计算上次的断点信息
 * @param range
 * @returns {number}
 * @private
 */
excel.prototype._calStartPosition = function (range) {
    var startPos = 0;
    if (typeof range != 'undefined') {
        var startPosMatch = /^bytes=([0-9]+)-$/.exec(range);
        startPos = Number(startPosMatch[1]);
    }
    return startPos;
}
excel.prototype._configHeader = function (config) {
    var startPos = config.startPos,
        fileSize = config.fileSize,
        resp = this.resp;
// 如果startPos为0，表示文件从0开始下载的，否则则表示是断点下载的。
    if (startPos == 0) {
        resp.setHeader('Accept-Range', 'bytes');
    } else {
        resp.setHeader('Content-Range', 'bytes ' + startPos + '-' + (fileSize - 1) + '/' + fileSize);
    }
    resp.writeHead(206, 'Partial Content', {
        'Content-Type': 'application/octet-stream'
    });
};
excel.prototype._init = function (filePath, down) {
    var config = {};
    var self = this;
    fs.stat(filePath, function (error, state) {
        if (error)
            throw error;
        config.fileSize = state.size;
        var range = self.req.headers.range;
        config.startPos = self._calStartPosition(range);
        self.config = config;
        self._configHeader(config);
        down();
    });
};
/**
 * 下载文件
 * @param filePath 文件路径
 * @param req
 * @param res
 * @param isDeleted 下载完成后是否删除文件，true删除
 */
excel.prototype.download = function (filePath, req, res, isDeleted) {
    var self = this;
    self.req = req;
    self.resp = res;
    fs.exists(filePath, function (exist) {
        if (exist) {
            self._init(filePath, function () {
                var config = self.config,
                resp = self.resp;
                var fReadStream = fs.createReadStream(filePath, {
                    encoding: 'binary',
                    bufferSize: 1024 * 1024,
                    start: config.startPos,
                    end: config.fileSize
                });
                fReadStream.on('data', function (chunk) {
                    resp.write(chunk, 'binary');
                });
                fReadStream.on('end', function () {
                    //是否删除文件
                    if (isDeleted) {
                        fs.unlink(filePath, function (err, res) {
                        });
                    }
                    resp.end();
                });
            });
        } else {
            console.log('文件不存在！');
            return;
        }
    });
};
module.exports = new excel();
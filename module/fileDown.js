var app=require('../app.js');

var excelExport = require('../util/excelExport');
var config = require('../config.json');
var path = require('path');

module.exports={
    excelFileDown:function(){
        app.get('/file/excelDown.xlsx', function (req, res) {
            var uid = req.session['passport']['user']['uid'];
            var fileName = req.url.split('?')[1] + uid + config.excel_file.extension_name;
            var filePath = path.resolve(config.excel_file.filePath, fileName);
            console.log("filepath:",filePath);
            console.log("fileName:",fileName);
            var isDeleted = false;
            excelExport.download(filePath, req, res, isDeleted);
            console.log( req.url +"   "+  req.method );
        });
    }
};
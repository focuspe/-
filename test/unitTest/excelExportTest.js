/********************************************************************************
 * Copyright (c) 2016.04 XiaoDi (Shanghai) Information Technologies Co. Ltd.
 * All rights reserved.
 ********************************************************************************/

/**
 * Created by Scott on 2016/9/5.
 * excelExport测试类
 */
var should = require('should'),
    excelExport = require('../../util/excelExport');
var TAG = "excelExportTest";

describe('excelExport',function () {
    describe('#createExcel', function () {
        it("should not return error when the createExcel is called.", function (done) {
            var conf ={};
            conf.cols = [
                {caption:'string', type:'string', key:"title"},
                {caption:'date', type:'string', key:"date"},
                {caption:'bool', type:'bool', key:"bool"},
                {caption:'number', type:'number', key:"number"}
            ];
            conf.rows = [
                {"title":'你好', "date":'2015-06-29', "bool":true, "number":3.14},
                {"title":"e", "date":'2015-06-29', "bool":false, "number":2.7182}
            ];
            var filename ="导出excel.xlsx";
            excelExport.createExcel({
                data:conf,
                // savePath: __dirname + "/public/resources",
                filename:filename,
                cb:function(error, path){
                    console.log("1",error);
                    should(error).not.be.ok();
                    done();
                }
            });
        });
    });
});
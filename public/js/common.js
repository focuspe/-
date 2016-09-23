/**
 *毫秒值转格式化日期
 */
var format = function(time, format){
    var t = new Date(time);
    var tf = function(i){return (i < 10 ? '0' : '') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
}


/**
 * Object转Json字符串
 * @param {type} Object
 * @returns {String|objectToJson.output}
 */
objectToJson = function(Object){
    var output = '';
    if (Object) {
        output += "{";
        for(var key in Object){
            var innerObject = Object[key];
            var innerObjectType = typeof innerObject;
            if(innerObjectType === 'string'){
                //如果内部Object是字符串，则在两边加引号
                innerObject = '"'+innerObject+'"';
            } else if(innerObjectType === 'object'){
                //如果内部Object是数字或布尔值，则递归
                innerObject = objectToJson(innerObject);
            } else if(innerObjectType === 'function'){
                //如果内部Object是数字或布尔值，则抛出错误
                innerObject = '"'+innerObject+'"';
//                return false;
            } else if(innerObjectType === 'number' ||
                innerObjectType === 'boolean'){
                //如果内部Object是数字或布尔值，则不做任何改变
//                innerObject = innerObject;
            }
            output += ' "' + key + '" : ' + innerObject + ',';
        }
        if(output.length > 1){
            output = output.substr(0, output.length-1);
        }
        output += "}";
    }
    return output;
};

/**
 * Object转GET参数
 * @param {type} Object
 * @returns {String|objectToJson.output}
 */
objectToParams = function(Object){
    var output = '';
    if (Object) {
        for(var key in Object){
            var innerObject = Object[key];
            output += key + '=' + innerObject + '&';
        }
        output = output.substr(0, output.length-1);;
    }
    return output;
};

/**
 * 生成Overlay
 * @param {type} forObject
 * @returns {jQuery|$}
 */
function generateOverlay(forObject){
    var thisOverlay =  $("<div></div>").css({"opacity":.9,
        "background-color":"#3EB3E8",
        "position":"absolute",
        "z-index":"999",
        "left":"20px",
        "width":$(forObject).width(),
        "height":$(forObject).height()
    });
    $(thisOverlay).appendTo($(forObject));
    $(thisOverlay).animate({"opacity":.3}, 1000);
    return $(thisOverlay);

}


function getLineObjectByEditableDivObject(editableDivObject){
    return $(editableDivObject).parent("td").parent("tr");
}

var editableObjectArray = {};



/**
 *
 * @returns {undefined}
 */
var initClickEvent = function(editRecordURL){
    // 点击修改
    $(".editableInput").parent().unbind("click");
    $(".editableInput").parent().on("click", function(){
        editableInputOnClick($(this).find(".editableInput"), editRecordURL);
    });
};

/**
 *
 * @param {type} data
 * @param {type} datatableColsParams 目前仅支持单主键的对象
 * @param {type} generateOperationTDContent
 * @returns {undefined}
 */
var generateDataForDatatable = function(data, datatableColsParams, generateOperationTDContent){
    var ddData = [];
    editableObjectArray = {};
    //console.log(data);
    for(var iDataRow in data){
        var row = [];
        var primaryKeyValue = operationForPrimaryKey(data[iDataRow], datatableColsParams);
        var operationTDContent = generateOperationTDContent(primaryKeyValue);
        if(operationTDContent){
            row.push(operationTDContent);
        }
        for(var index in datatableColsParams){
            var datatableColsParamObj = datatableColsParams[index];
            if(!$.isArray(datatableColsParamObj)){
                if(!datatableColsParamObj.hidden){
                    var cellValue = datatableColsParamObjToCell(data, datatableColsParamObj, iDataRow, primaryKeyValue);
                    row.push(cellValue);
                }
            } else {
                if(!datatableColsParamObj.hidden) {
                    var cellValue = "";
                    for (var indexInner in datatableColsParamObj) {
                        cellValue += datatableColsParamObjToCell(data, datatableColsParamObj[indexInner], iDataRow, primaryKeyValue) + "<br/>";
                    }
                    row.push(cellValue);
                }
            }
        }
        ddData.push(row);
    }
    return ddData;
};

/**
 *
 * @param data
 * @param datatableColsParams
 * @returns {*}
 */
var operationForPrimaryKey = function(dataRow, datatableColsParams){
    var primaryKeyValue;
    for(var index in datatableColsParams){
        if(!$.isArray(datatableColsParams[index])){
            var iColKey = datatableColsParams[index].key;
            var isPrimaryKey = datatableColsParams[index].isPrimaryKey;
            var iColValue = dataRow[iColKey];
            if(isPrimaryKey){
                primaryKeyValue = iColValue;
                editableObjectArray[primaryKeyValue] = dataRow;
            }
        }
    }
    return primaryKeyValue;
}

/**
 *
 * @param data
 * @param datatableColsParamObj
 * @param iDataRow
 * @param primaryKeyValue
 * @returns {string}
 */
var datatableColsParamObjToCell = function(data, datatableColsParamObj, iDataRow, primaryKeyValue){

    var iColKey = datatableColsParamObj.key;
    var isEditable = datatableColsParamObj.editable;
    var isPrimaryKey = datatableColsParamObj.isPrimaryKey;
    var type = datatableColsParamObj.type;
    var hidden = datatableColsParamObj.hidden;
    var options = datatableColsParamObj.options;
    var iColValue = data[iDataRow][iColKey];
    var plugin = datatableColsParamObj.plugin;
    if(iColValue === null){
        iColValue = "";
    }
    var cellValue = "";
    if(!hidden){
        if($.isFunction(plugin)){
            //如果提供插件，则通过插件生成内容
            cellValue = plugin(data[iDataRow]);
            return cellValue;
        }
        if(isEditable){
            //设成可编辑的Input
            cellValue += generateEditableCell(iColKey, iColValue, type, primaryKeyValue, options);
        } else {
            cellValue += generateNotEditableCell(iColKey, iColValue, type, primaryKeyValue, options);
        }
    }
    return cellValue;

}


/**
 *
 * @param {type} key
 * @param {type} value
 * @param {type} type
 * @param {type} primaryKeyValue
 * @param {type} options
 * @returns {String}
 */
function generateNotEditableCell(key, value, type, primaryKeyValue, options){
//    editableObjectArray[primaryKeyValue][key] = value;
    if(type === "Date"){
        var dateObj = new Date(value);
        var dateObjStr = dateObj.format("yyyy/MM/dd hh:mm:ss");
        //重写缓存中的日期属性值
        editableObjectArray[primaryKeyValue][key] = dateObjStr;
        return "<span>"+dateObjStr+"</span>";
    } else if(type === "Enum"){
        var optionValue = "";
        for(var index in options){
            if(options[index].id === value){
                optionValue = options[index].text;
            }
        }
        return value+"<input name='"+key+"' class='' data-targetid='"+primaryKeyValue+"' value='"+optionValue+"' style='display: none;'/>";
    } else if(type === "Image"){
        return "<img name='"+key+"' src='"+value+"'  width='60' height='40'/>";
    } else {
        return value+"<input name='"+key+"' class='' data-targetid='"+primaryKeyValue+"' value='"+value+"' style='display: none;'/>";
    }
}
/**
 * 自动生成可编辑DataTable
 * @param {type} key
 * @param {type} value
 * @param {type} type
 * @param {type} primaryKeyValue
 * @param {type} options
 * @returns {String}
 */
function generateEditableCell(key, value, type, primaryKeyValue, options){
    if(type === "Date"){
        var dateObj = new Date(value);
        var dateObjStr = dateObj.format("yyyy/MM/dd hh:mm");
        //重写缓存中的日期属性值
        editableObjectArray[primaryKeyValue][key] = dateObjStr;
        return "<div class='editableInput'><span>"+dateObjStr+"</span><input name='"+key+"' onclick='initDatetimePicker(this)' onfocus='initDatetimePicker(this)' class='' value='"+dateObjStr+"' data-targetid='"+primaryKeyValue+"' style='display: none;'/></div>";
    } else if(type === "Enum"){
        var optionsStr = "";
        var optionValue = "";
        for(var index in options){
            if(options[index].id === value){
                optionsStr += "<option value='"+options[index].id+"' selected='selected'>"+options[index].text+"</option>";
                optionValue = options[index].text;
            } else {
                optionsStr += "<option value='"+options[index].id+"'>"+options[index].text+"</option>";
            }
        }
        return "<div class='editableInput'><span>"+optionValue+"</span><select name='"+key+"' class='' data-targetid='"+primaryKeyValue+"' style='display: none;'>"+optionsStr+"</select></div>";
    } else {
        return "<div class='editableInput'><span>"+value+"</span><input name='"+key+"' class='' value='"+value+"' data-targetid='"+primaryKeyValue+"' style='display: none;'/></div>";
    }
}

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
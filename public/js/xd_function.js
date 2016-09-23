
$(document).ready(function() {
});

var hostname = "";

//var effectiveStockSearchUrl = hostname + "/api/carMgmt/searchAvailableStock";
//var searchAvailableStockUrl = hostname + "/api/carMgmt/searchAvailableStock";

/*******************************************************/
/*URL CONNECTIONS*/
var searchStockUrl = hostname+"/ds/carMgmt/searchStock";
var searchOnShelfCarsUrl = hostname+"/api/carMgmt/searchOnShelfCars";
var getTopBrandListUrl = hostname+"/ds/carMgmt/getTopBrandList";
var getTypeListUrl = hostname+"/ds/carMgmt/getTypeList";
var getModelListUrl = hostname+"/ds/carMgmt/getModelList";
var getModelConfigUrl = hostname+"/ds/carMgmt/getModelConfig";
var searchDsCarsUrl = hostname+"/ds/carMgmt/searchDsCars";

var getFsListUrl = hostname+"/ds/carMgmt/getFsList";
var getPurchaseIntentUrl = hostname+"/ds/carMgmt/getPurchaseIntent";
var addRecordUrl = hostname+"/ds/carMgmt/addStock";
var addGroupRecordsUrl = hostname+"/ds/carMgmt/uploadStock";
var downloadModelUrl = hostname+"/ds/carMgmt/downloadExample";

var getTagListUrl = hostname+"/ds/carMgmt/getTagList";
var updateModelInTopUrl = hostname+"/ds/carMgmt/updateModelInTop";
var addTagUrl = hostname+"/ds/carMgmt/addTag";
var getUpgradeItemListUrl = hostname+"/ds/carMgmt/getUpgradeItemList";
var addUpgradeItemUrl = hostname+"/ds/carMgmt/addUpgradeItem";
var releaseCarUrl = hostname+"/ds/carMgmt/releaseCar";

var searchSoldCarsUrl = hostname+"/api/carMgmt/searchSoldCars";
var getReleaseCarInfoUrl = hostname+"/ds/carMgmt/getReleaseCarInfo";
var getInventoryInfoUrl = hostname + "/ds/carMgmt/getInventory";
var soldDsCarOnsaleStateUrl = hostname+"/ds/carMgmt/soldDsCarOnsaleState";
var updateModelNameUrl = hostname+"/ds/carMgmt/updateModelName";


var carStateDict = {0:"售出", 1:"上架", 2:"下架", 3:"删除"};

/**
 * 获取multiple的select选中的内容
 */
function getMultipleSelectVal(obj){
    var valArray = $(obj).val();
    var valList = "";
    for(var key in valArray){
        valList += valArray[key]+",";
    }
    if(valList.length>0){
        valList = valList.substring(0,valList.length-1)
    }
    return valList;
}

/**
 * 获取checkbox选中的内容
 */
function getCheckboxInputVal(objName){
    var valList = "";
    $('input:checkbox[name='+objName+']:checked').each( function() {
        valList += $(this).val()+",";
    });
    if(valList.length>0){
        valList = valList.substring(0,valList.length-1)
    }
    return valList;
}

/**
 * 获取radio选中的内容
 */
function getRadioInputVal(objName){
    return $('input:radio[name='+objName+ ']:checked').val()
}

/**
 * 判断input是否为空
 */
function isWysihtml5ValEmpty(objId){
    console.log($("#"+objId).html());
    console.log($("#"+objId).val());
    console.log($("#"+objId).find("div").html());
    if($("#"+objId).find("div").html() == ""){
        $("#"+objId).parents(".form-group").removeClass("has-success");
        $("#"+objId).parents(".form-group").addClass("has-error");
        var helpBlock = $("#"+objId).parents(".form-group").find(".help-block");
        if(helpBlock != null){
            $("#"+objId).parents(".form-group").find(".help-block").show();
        }
        return false;
    } else {
        $("#"+objId).parents(".form-group").removeClass("has-error");
        $("#"+objId).parents(".form-group").addClass("has-success");
        var helpBlock = $("#"+objId).parents(".form-group").find(".help-block");
        if(helpBlock != null){
            $("#"+objId).parents(".form-group").find(".help-block").hide();
        }
        return true;
    }
}

/**
 * 判断input是否为空
 */
function isInputValEmpty(objId){
    if($("#"+objId).val() == ""){
        $("#"+objId).parents(".form-group").removeClass("has-success");
        $("#"+objId).parents(".form-group").addClass("has-error");
        var helpBlock = $("#"+objId).parents(".form-group").find(".help-block");
        if(helpBlock != null){
            $("#"+objId).parents(".form-group").find(".help-block").show();
        }
        return false;
    } else {
        $("#"+objId).parents(".form-group").removeClass("has-error");
        $("#"+objId).parents(".form-group").addClass("has-success");
        var helpBlock = $("#"+objId).parents(".form-group").find(".help-block");
        if(helpBlock != null){
            $("#"+objId).parents(".form-group").find(".help-block").hide();
        }
        return true;
    }
}

/**
 * 判断select是否为空
 */
function isSelectValEmpty(objId){
    if($("#"+objId).val() == "" || $("#"+objId).val() == null || $("#"+objId).val().length == 0){
        $("#"+objId).parents(".form-group").removeClass("has-success");
        $("#"+objId).parents(".form-group").addClass("has-error");
        var helpBlock = $("#"+objId).parents(".form-group").find(".help-block");
        if(helpBlock != null){
            $("#"+objId).parents(".form-group").find(".help-block").show();
        }
        return false;
    } else {
        $("#"+objId).parents(".form-group").removeClass("has-error");
        $("#"+objId).parents(".form-group").addClass("has-success");
        var helpBlock = $("#"+objId).parents(".form-group").find(".help-block");
        if(helpBlock != null){
            $("#"+objId).parents(".form-group").find(".help-block").hide();
        }
        return true;
    }
}

/**
 * 判断checkbox是否为空
 */
function isCheckboxValEmpty(objName){
    if($('input:checkbox[name='+objName+']:checked').length == 0){
        var obj = $('input:checkbox[name='+objName+']')[0];
        $(obj).parents(".form-group").removeClass("has-success");
        $(obj).parents(".form-group").addClass("has-error");
        var helpBlock = $(obj).parents(".form-group").find(".help-block");
        if(helpBlock != null){
            $(obj).parents(".form-group").find(".help-block").show();
        }
        return false;
    } else {
        var obj = $('input:checkbox[name='+objName+']')[0];
        $(obj).parents(".form-group").removeClass("has-error");
        $(obj).parents(".form-group").addClass("has-success");
        var helpBlock = $(obj).parents(".form-group").find(".help-block");
        if(helpBlock != null){
            $(obj).parents(".form-group").find(".help-block").hide();
        }
        return true;
    }
}

/**
 * 判断radio是否为空
 */
function isRadioValEmpty(objName){
    if($('input:radio[name='+objName+']:checked').length == 0){
        var obj = $('input:radio[name='+objName+']')[0];
        $(obj).parents(".form-group").removeClass("has-success");
        $(obj).parents(".form-group").addClass("has-error");
        var helpBlock = $(obj).parents(".form-group").find(".help-block");
        if(helpBlock != null){
            $(obj).parents(".form-group").find(".help-block").show();
        }
        return false;
    } else {
        var obj = $('input:radio[name='+objName+']')[0];
        $(obj).parents(".form-group").removeClass("has-error");
        $(obj).parents(".form-group").addClass("has-success");
        var helpBlock = $(obj).parents(".form-group").find(".help-block");
        if(helpBlock != null){
            $(obj).parents(".form-group").find(".help-block").hide();
        }
        return true;
    }
}


var resetBeforeInputValue = function(obj){
    $(obj).prev("input").val("");
};

var datepickerOptions = {
    language: 'zh-CN',
    autoclose: 1,
    todayBtn: 1,
    pickerPosition: "bottom-left",
    hourStep: 1,
    minuteStep: 15,
    secondStep: 30,
    startView: 2,
    minView: 2,
    dateFormat: 'yyyy-mm-dd',
    changeMonth: true,
    changeYear: true,
    pickDate: true,
    pickTime: false,
    monthNamesShort: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    stepMinute: 10,
    stepSecond: 10,
    dayNamesMin: [ "七","一", "二", "三", "四", "五", "六"],
//        monthNamesShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"]
//    maxDate: "+1w"
};

var datetimepickerOptions = {
    value:'',
    lang:'ch',
    format:'yyyy-mm-dd H:i',
    formatTime:'H:i',
    formatDate:'yyyy-mm-dd',
    step:15,
    closeOnDateSelect:1,
    closeOnWithoutClick:true,
    timepicker:true,
    datepicker:true,
    minDate:false,
    maxDate:false,
    minTime:false,
    maxTime:false,
    allowTimes:[],
    opened:false,
    inline:false,
    onSelectDate:function() {},
    onSelectTime:function() {},
    onChangeMonth:function() {},
    onChangeDateTime:function() {},
//    onShow:function() {},
    onShow: function( ct ){
        this.setOptions({
            maxDate:$('#hmc_ura_time_end').val()?"+"+$('#hmc_ura_time_end').val():false
        });
    },
    onClose:function() {},
    onGenerate:function() {},
    withoutCopyright:true,
    inverseButton:false,
    hours12:false,
    next:	'xdsoft_next',
    prev : 'xdsoft_prev',
    dayOfWeekStart:0,
    timeHeightInTimePicker:25,
    timepickerScrollbar:true,
    todayButton:true, // 2.1.0
    defaultSelect:true, // 2.1.0
    scrollMonth:true,
    scrollTime:true,
    scrollInput:true,
    mask:false,
    validateOnBlur:true,
    allowBlank:false,
    yearStart:1950,
    yearEnd:2050,
    style:'',
    id:'',
    roundTime:'round', // ceil, floor
    className:'',
    weekends	: 	[],
    yearOffset:0
};



var hmc_is_debug = false;

var hmcDebug = function(msg){
    if(hmc_is_debug){
        console.log(msg);
    }
};

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
//                hmcDebug("objectToJson() ERROR 无法将function转换成json!");
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
//    hmcDebug("objectToJson() output:" + output);
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
  
/**
 * 自动生成可编辑DataTable
 * @param {type} editableDivObject
 * @param {type} editRecordURL
 * @returns {undefined}
 */
function editableInputOnClick(editableDivObject, editRecordURL){
    var valueBefore = $(editableDivObject).find(".hmc_edit_param").first().val();
    $(editableDivObject).find("span").hide();
    $(editableDivObject).find(".hmc_edit_param").first().show().focus().trigger("focus");
    $(editableDivObject).find(".hmc_edit_param").first().on("focusout", function(e){
        var editParamObject = $(this);
        setTimeout(function(){
            if(!isDatetimePickerHover){
                $(editParamObject).prev("span").show();
                var valueAfter = $(editParamObject).val();
                if(valueBefore !== valueAfter){
                    if($(editParamObject).is("input")){
                        $(editParamObject).prev("span").html(valueAfter);
                        editRecordAuto($(editableDivObject), editRecordURL);
                    } else if($(editParamObject).is("select")){
                        var text = $(editParamObject).find("option[value='"+valueAfter+"']").html();
                        $(editParamObject).prev("span").html(text);
                        editRecordAuto($(editableDivObject), editRecordURL);
                    } else {
                        printErrormsg("不支持input、select以外的其它元素！");
                    }
                }
                $(editParamObject).hide();
                $(editParamObject).unbind("focusout");
            }
        }, 100);
    });
}

function getLineObjectByEditableDivObject(editableDivObject){
    return $(editableDivObject).parent("td").parent("tr");
}

var editableObjectArray = {};

/**
 * 自动生成可编辑DataTable
 * @param {type} editableDivObject
 * @param {type} editRecordURL
 * @returns {undefined}
 */
function editRecordAuto(editableDivObject, editRecordURL) {
    var trObject = getLineObjectByEditableDivObject(editableDivObject);
    var thisOverlay = generateOverlay($(trObject));
    
    var primaryKeyValue = $(editableDivObject).find(".hmc_edit_param").first().attr("data-targetid");
    var thisKey = $(editableDivObject).find(".hmc_edit_param").first().attr("name");
    editableObjectArray[primaryKeyValue][thisKey] = $(editableDivObject).find(".hmc_edit_param").first().val();
    var requestData = editableObjectArray[primaryKeyValue];
    
//    var requestData = {};
//    $(trObject).find(".hmc_edit_param").each(function(){
////        var thisInput = $(this).find("input").first();
//        var thisInput = $(this);
//        var key = thisInput.attr("name");
//        var value = thisInput.val();
//        requestData[key] = value;
//    });
    $.ajax({
        type: "POST",
        url: editRecordURL,
        data: requestData,
        success: function (data) {
            printResponseJSONDataMsg(data);
            $(thisOverlay).remove();
        },
        error: function (data) {
            printAjaxError(data);
            $(thisOverlay).remove();
        }
    });
}

/**
 * 自动生成可编辑DataTable
 * 并通过Json向后台发送编辑请求
 * @param {type} editableDivObject
 * @param {type} editRecordURL
 * @returns {undefined}
 */
function editRecordAutoWithJson(editableDivObject, editRecordURL) {
    var trObject = getLineObjectByEditableDivObject(editableDivObject);
    var thisOverlay = generateOverlay($(trObject));

    var requestDataJson = "{";
    $(trObject).find(".hmc_edit_param").each(function(){
//        var thisInput = $(this).find("input").first();
        var thisInput = $(this);
        var key = thisInput.attr("name");
        var value = thisInput.val();
        requestDataJson += key+":'"+value+"',";
    });
    if(requestDataJson.length > 1){
        requestDataJson = requestDataJson.substr(0, requestDataJson.length-1);
    }
    requestDataJson += "}";
    $.ajax({
        type: "POST",
        url: editRecordURL,
        dataType: "json",
        contentType: "application/json",
        data: requestData,
        success: function (data) {
            printResponseJSONDataMsg(data);
            $(thisOverlay).remove();
        },
        error: function (data) {
            printAjaxError(data);
            $(thisOverlay).remove();
        }
    });
}

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
        return value+"<input name='"+key+"' class='hmc_edit_param' data-targetid='"+primaryKeyValue+"' value='"+optionValue+"' style='display: none;'/>";
    } else if(type === "Image"){
        return "<img name='"+key+"' src='"+value+"'  width='60' height='40'/>";
    } else {
        return value+"<input name='"+key+"' class='hmc_edit_param' data-targetid='"+primaryKeyValue+"' value='"+value+"' style='display: none;'/>";
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
        return "<div class='editableInput'><span>"+dateObjStr+"</span><input name='"+key+"' onclick='initDatetimePicker(this)' onfocus='initDatetimePicker(this)' class='hmc_edit_param' value='"+dateObjStr+"' data-targetid='"+primaryKeyValue+"' style='display: none;'/></div>";
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
        return "<div class='editableInput'><span>"+optionValue+"</span><select name='"+key+"' class='hmc_edit_param' data-targetid='"+primaryKeyValue+"' style='display: none;'>"+optionsStr+"</select></div>";
    } else {
        return "<div class='editableInput'><span>"+value+"</span><input name='"+key+"' class='hmc_edit_param' value='"+value+"' data-targetid='"+primaryKeyValue+"' style='display: none;'/></div>";
    }
}

var isDatetimePickerHover = false;

/**
 * 
 * @param {type} object
 * @returns {undefined}
 */
var initDatetimePicker = function(object){
    isDatetimePickerHover=false;
    if(!$(object).attr("data-isinit")){
        $(object).attr("data-isinit", "true");
        $(object).datetimepicker(datetimepickerOptions);
        $("#ui-datepicker-div").hover(
            function(){
                isDatetimePickerHover=true;
            },
            function(){
                isDatetimePickerHover=false;
            }
        );
    }
};

/**
 * 打印返回的JSON对象的信息
 * @param {type} JSONData
 * @returns {undefined}
 */
var printErrorResponseJSONDataMsg = function(JSONData){
    if(JSONData){
        if(hmc_is_debug){
            var datataStr = $.toJSON(JSONData);
            hmcDebug("printResponseJSONDataMsg() dataStr:" + datataStr);
        }
        if(JSONData.errormsg){
            printErrormsg(JSONData.errormsg);
        }
        if(JSONData.errorcode && JSONData.errorcode !== "-1"){
            printErrorcode(JSONData.errorcode);
        }
    }
};

/**
 * 打印返回的JSON对象的信息
 * @param {type} JSONData
 * @returns {undefined}
 */
var printResponseJSONDataMsg = function(JSONData){
    if(JSONData){
        if(hmc_is_debug){
            var datataStr = $.toJSON(JSONData);
            hmcDebug("printResponseJSONDataMsg() dataStr:" + datataStr);
        }
        if(JSONData.successmsg){
            printSuccessmsg(JSONData.successmsg);
        }
        if(JSONData.errormsg){
            printErrormsg(JSONData.errormsg);
        }
        if(JSONData.errorcode && JSONData.errorcode !== "-1"){
            printErrorcode(JSONData.errorcode);
        }
    }
};

/**
 * 打印成功信息
 * @param {type} successmsg
 * @returns {undefined}
 */
var printSuccessmsg = function(successmsg){
    hmcDebug("printSuccessmsg() successmsg:" + successmsg);
    $.pnotify({
        pnotify_title: "成功",
        pnotify_text: ""+successmsg,
        pnotify_type: 'notify',
        pnotify_delay: '4000', //停留时间为4秒
        pnotify_animation: {
            effect_in: 'fade',
            effect_out: 'explode'
        }
    });
};

/**
 * 打印错误信息
 * @param {type} errormsg
 * @returns {undefined}
 */
var printErrormsg = function(errormsg){
    console.log("printErrormsg() errormsg:" + errormsg);
//    hmcDebug("printErrormsg() errormsg:" + errormsg);
    $.pnotify({
        pnotify_title: "失败",
        pnotify_text: ""+errormsg,
        pnotify_type: 'error',
        //pnotify_delay: '6000000', //停留时间为10分钟
        pnotify_delay: '10000', //停留时间为10秒
        pnotify_animation: {
            effect_in: 'fade',
            effect_out: 'explode'
        }
    });
};

/**
 * 打印错误码
 * @param {type} errorcode
 * @returns {undefined}
 */
var printErrorcode = function(errorcode){
    console.log("printErrorcode() errorcode:" + errorcode);
//    hmcDebug("printErrorcode() errorcode:" + errorcode);
    $.pnotify({
        pnotify_title: "失败代码",
        pnotify_text: ""+errorcode,
        pnotify_type: 'error',
        pnotify_delay: '10000', //停留时间为10秒
        pnotify_animation: {
            effect_in: 'fade',
            effect_out: 'explode'
        }
    });
};

/**
 * 打印Ajax连接错误信息
 * @param {type} errormsg
 * @returns {undefined}
 */
var printAjaxError = function(data){
    if(hmc_is_debug){
        hmcDebug("printAjaxError() dataStr:" + $.toJSON(data));
    }
    var msg = "Ajax连接出错！";
    if(data.readyState === 0){
        msg += "准备状况：未连接；";
    } else if(data.readyState === 1){
        msg += "准备状况：打开连接；";
    } else if(data.readyState === 2){
        msg += "准备状况：发送请求；";
    } else if(data.readyState === 3){
        msg += "准备状况：交互；";
    } else if(data.readyState === 4){
        msg += "准备状况：完成交互，接手响应；";
    }
    if(data.status){
        msg += "连接状态："+data.status+"；";
    }
    if(data.statusText){
        msg += "错误信息："+data.statusText+"；";
    }
    printErrormsg(msg);
};

/**
 * JQuery方法
 * @param {type} $
 * @returns {undefined}
 */
(function($) {
    
    $.downloadFileWithForm = function(url, dataObject, method) {
        //url and data options required
        if (url && dataObject) {
            hmcDebug("正在下载数据，url:"+url+", dataObject:"+objectToJson(dataObject)+", method:"+method);
            //data can be string of parameters or array/object
            //split params into form inputs
            var inputs = '';
            for(var key in dataObject){
                inputs += '<input type="hidden" name="' + key + '" value="' + dataObject[key] + '" />';
            }

            //send request
            $('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>').appendTo('body').submit().remove();
        }
        ;
    };
    
    
})(jQuery);

Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1,
        // month
        "d+": this.getDate(),
        // day
        "h+": this.getHours(),
        // hour
        "m+": this.getMinutes(),
        // minute
        "s+": this.getSeconds(),
        // second
        "q+": Math.floor((this.getMonth() + 3) / 3),
        // quarter
        "S": this.getMilliseconds()
        // millisecond
    };
    if (/(y+)/.test(format) || /(Y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

var timestampformatMillsSecond = function(timestampMillsSecond) {
    return (new Date(timestampMillsSecond)).format("yyyy/MM/dd hh:mm:ss");
};

var timestampformatSecond = function(timestampSecond) {
    return (new Date(timestampSecond * 1000)).format("yyyy/MM/dd hh:mm:ss");
};

var defaultbButtonDisabledTimeout = 500;
/**
 * 让button在一定时间内不可用
 * @param {type} object
 * @param {type} timeout disabled的毫秒数
 * @returns {undefined}     */
var setButtonDisabled = function(object, timeout){
    $(object).attr("disabled", "disabled");
    if(timeout){
        setTimeout(function(){
            $(object).removeAttr("disabled");
        }, timeout);
    }
};
/**
 * 恢复button可用
 * @param {type} object
 * @returns {undefined}     */
var setButtonEnable = function(object){
    $(object).removeAttr("disabled");
};

/**
 * 正则表达式实现startWith函数 
 * @param {type} str
 * @returns {Boolean}
 */
String.prototype.startWith=function(str){ 
    var reg=new RegExp("^"+str); 
    return reg.test(this); 
};

/**
 * 正则表达式实现endWith函数 
 * @param {type} str
 * @returns {Boolean}
 */
//直接使用str.endWith("abc")方式调用即可 
String.prototype.endWith=function(str){ 
    var reg=new RegExp(str+"$"); 
    return reg.test(this); 
};

// 除非必要，尽量不要去扩展全局对象，因为对全局对象的扩展会造成所有继承链上都带上“烙印”，而有时候这些烙印会成为滋生bug的温床。
//Array.prototype.remove = function() {
//    var what, a = arguments, L = a.length, ax;
//    while (L && this.length) {
//        what = a[--L];
//        while ((ax = this.indexOf(what)) !== -1) {
//            this.splice(ax, 1);
//        }
//    }
//    return this;
//};
//
//var ary = ['three', 'seven', 'eleven'];
//
//ary.remove('seven');

/*  
 * To make it a global-
 * returned value: (Array)
 * three,eleven
*/
function removeStringFromArray(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

//var ary = ['three', 'seven', 'eleven'];
//removeFromArray(ary, 'seven');

/*  
 * to take care of IE8 and below-
 * returned value: (Array)
 * three,eleven
*/
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(what, i) {
        i = i || 0;
        var L = this.length;
        while (i < L) {
            if(this[i] === what) return i;
            ++i;
        }
        return -1;
    };
}



/*select2列表接口*/

/**
 * 品牌列表接口
 * @param carInfoData
 * @param carBrandObj
 * @param carTypeObj
 * @param carModelObj
 * @param vinObj
 * @param emptyValueByDefault
 * @param selectCallback
 */
function initTopBrandListWithSelect2(carInfoData, carBrandObj, carTypeObj, carModelObj, vinObj, emptyValueByDefault, selectCallback) {
    var requestData = {};
    $.ajax({
        type: "POST",
        url: getTopBrandListUrl,
        dataType: "json",
        data: requestData,
        success: function (response) {
            if (typeof(response.status) != undefined && response.status == 1) {
                //console.log("品牌列表接口返回信息" + response.msg);
                if(response.data && response.data.length > 0) {
                    var select2Data = [];
                    for (var dataIndex in response.data) {
                        select2Data.push({
                            id: response.data[dataIndex].brandId,
                            text: response.data[dataIndex].brandName
                        });
                    }
                    $(carBrandObj).unbind("select2:select");
                    $(carBrandObj).html("");
                    $(carBrandObj).select2({
                        data: select2Data,
                        placeholder: "请选择品牌",
                        allowClear: emptyValueByDefault
                    }).trigger("change");
                    if(carInfoData && carInfoData.topBrandId){
                        $(carBrandObj).select2().val(carInfoData.topBrandId).trigger("change");
                        $(carBrandObj).prop("disabled", true);
                        //console.log("initTopBrandListWithSelect2() 设置为初始化值val:"+ carInfoData.topBrandId+",并置为不可编辑");
                    } else {
                        if (emptyValueByDefault) {
                            $(carBrandObj).select2().val("").trigger("change");
                            //console.log("initTopBrandListWithSelect2() 设置空值, val:" + $(carBrandObj).select2().val());
                            if (selectCallback && typeof selectCallback == "function") {
                                selectCallback()
                            }
                        }
                        //console.log("initTopBrandListWithSelect2() 给品牌列表select2绑定事件,当select2改变时,更新车型列表");
                        $(carBrandObj).on("select2:select", function (e) {
                            initCarTypeListWithSelect2(carInfoData, carBrandObj, carTypeObj, carModelObj, vinObj, emptyValueByDefault, selectCallback);
                        });
                    }
                    initCarTypeListWithSelect2(carInfoData, carBrandObj, carTypeObj, carModelObj, vinObj, emptyValueByDefault, selectCallback);
                } else {
                    //console.log("initTopBrandListWithSelect2() 返回参数错误");
                    $(carTypeObj).html("");
                    $(carTypeObj).select2();
                    if(selectCallback && typeof selectCallback == "function"){
                        selectCallback()
                    }
                }
            } else {
                //console.log("initTopBrandListWithSelect2() 品牌列表接口返回信息" + response.msg);
            }
        },
        error: function (data) {
            printAjaxError(data);
        }
    });
}


/**
 * 车型列表接口
 * @param carInfoData
 * @param carBrandObj
 * @param carTypeObj
 * @param carModelObj
 * @param vinObj
 * @param emptyValueByDefault
 * @param selectCallback
 */
function initCarTypeListWithSelect2(carInfoData, carBrandObj, carTypeObj, carModelObj, vinObj, emptyValueByDefault, selectCallback) {
    var topBrandId = $(carBrandObj).val();
    console.log(topBrandId);
    var requestData = {topBrandId: topBrandId};
    if(topBrandId){
        $.ajax({
            type: "POST",
            url: getTypeListUrl,
            dataType: "json",
            data: requestData,
            success: function (response) {
                if (typeof(response.status) != undefined && response.status == 1) {
                    //console.log("initCarTypeListWithSelect2() success 车型列表接口返回信息 " + response.msg);
                    if(response.data && response.data.length > 0) {
                        var select2Data = [];
                        for (var dataIndex in response.data) {
                            select2Data.push({
                                id: response.data[dataIndex].typeId,
                                text: response.data[dataIndex].typeName
                            });
                        }
                        $(carTypeObj).unbind("select2:select");
                        $(carTypeObj).html("");
                        $(carTypeObj).select2({
                            data: select2Data,
                            placeholder: "请选择车型",
                            allowClear: emptyValueByDefault
                        }).trigger("change");
                        var carTypeChange = function(carInfoData, carTypeObj, carModelObj, vinObj, emptyValueByDefault, selectCallback) {
                            initCarModelListWithSelect2(carInfoData, carTypeObj, carModelObj, vinObj, emptyValueByDefault, selectCallback);
                        }
                        if(carInfoData && carInfoData.carTypeId){
                            $(carTypeObj).select2().val(carInfoData.carTypeId).trigger("change");
                            $(carTypeObj).prop("disabled", true);
                            //console.log("initCarTypeListWithSelect2() 设置为初始化值val:"+ carInfoData.carTypeId+",并置为不可编辑");
                        } else {
                            if (emptyValueByDefault) {
                                $(carTypeObj).select2().val("").trigger("change");
                                //console.log("initCarTypeListWithSelect2() 设置空值, val:" + $(carTypeObj).select2().val());
                                if (selectCallback && typeof selectCallback == "function") {
                                    selectCallback()
                                }
                            }
                            //console.log("initCarTypeListWithSelect2() 给车型列表select2绑定事件,当select2改变时,更新车款列表");
                            $(carTypeObj).on("select2:select", function (e) {
                                carTypeChange(carInfoData, carTypeObj, carModelObj, vinObj, emptyValueByDefault, selectCallback);
                            });
                        }
                        carTypeChange(carInfoData, carTypeObj, carModelObj, vinObj, emptyValueByDefault, selectCallback);
                    }else{
                        //console.log("initCarTypeListWithSelect2() 返回参数错误");
                        $(carTypeObj).html("");
                        $(carTypeObj).select2();
                        if(selectCallback && typeof selectCallback == "function"){
                            selectCallback()
                        }
                    }
                } else {
                    //console.log("车型列表接口返回信息" + response.msg);
                }
            },
            error: function (data) {
                printAjaxError(data);
            }
        });

    }
}


/**
 * 车款列表接口
 * @param carInfoData
 * @param carTypeObj
 * @param carModelObj
 * @param vinObj
 * @param emptyValueByDefault
 * @param selectCallback
 */
function initCarModelListWithSelect2(carInfoData, carTypeObj, carModelObj, vinObj, emptyValueByDefault, selectCallback) {
    var typeId = $(carTypeObj).val();
    var requestData = {typeId: typeId};
    if(typeId){
        $.ajax({
            type: "POST",
            url: getModelListUrl,
            dataType: "json",
            data: requestData,
            success: function (response) {
                if (typeof(response.status) != undefined && response.status == 1) {
                    //console.log("initCarModelListWithSelect2() 车款列表接口返回信息 " + response.msg);
                    if(response.data && response.data.length > 0) {

                        var select2Data = [];
                        for (var dataIndex in response.data) {
                            select2Data.push({
                                id: response.data[dataIndex].modelId,
                                text: response.data[dataIndex].modelName,
                                msrp: response.data[dataIndex].msrp
                            });

                        }
                        $(carModelObj).unbind("select2:select");
                        $(carModelObj).html("");
                        $(carModelObj).select2({
                            data: select2Data,
                            placeholder: "请选择车款",
                            allowClear: emptyValueByDefault
                        }).trigger("change");
                        function carModelChange(carInfoData, carModelObj, vinObj, emptyValueByDefault, selectCallback){

                            initCarModelConfig(carInfoData, carModelObj, vinObj, emptyValueByDefault, selectCallback);
                        }
                        if(carInfoData && carInfoData.topBrandId){
                            $(carModelObj).select2().val(carInfoData.carModelId).trigger("change");
                            $(carModelObj).prop("disabled", true);
                            //console.log("initCarModelListWithSelect2() 设置为初始化值val:"+ carInfoData.carModelId+",并置为不可编辑");
                        } else {
                            if (emptyValueByDefault) {
                                $(carModelObj).select2().val("").trigger("change");
                                //console.log("initCarModelListWithSelect2() 设置空值, val:" + $(carModelObj).select2().val());
                                if (selectCallback && typeof selectCallback == "function") {
                                    selectCallback()
                                }
                            }else{
                                //$(carModelObj).trigger("change");
                            }
                            //console.log("initCarModelListWithSelect2() 给车款列表select2绑定事件,当select2改变时,更新vin列表,并填入相关信息");
                            $(carModelObj).on("select2:select", function (e) {
                                carModelChange(carInfoData, carModelObj, vinObj, emptyValueByDefault, selectCallback);
                            });
                        }
                        carModelChange(carInfoData, carModelObj, vinObj, emptyValueByDefault, selectCallback);
                    }else{
                        //console.log("initCarModelListWithSelect2() 车款列表接口返回信息 " + response.msg);
                        $(carModelObj).html("");
                        $(carModelObj).select2();
                        if(selectCallback && typeof selectCallback == "function"){
                            selectCallback()
                        }
                    }
                } else {
                    //console.log("initCarModelListWithSelect2() 车款列表接口返回信息 " + response.msg);
                }
            },
            error: function (data) {
                printAjaxError(data);
            }
        });
    }
}


/**
 * 车款参数接口接口
 * @param carInfoData
 * @param carModelObj
 * @param vinObj
 * @param emptyValueByDefault
 * @param selectCallback
 */
function initCarModelConfig(carInfoData, carModelObj, vinObj, emptyValueByDefault, selectCallback) {
    var modelId = $(carModelObj).val();
    var requestData = {modelId: modelId};
    if(modelId){
        $.ajax({
            type: "POST",
            url: getModelConfigUrl,
            dataType: "json",
            data: requestData,
            success: function (response) {
                if (typeof(response.status) != undefined && response.status == 1) {
                    console.log("initCarModelConfig() 车款参数接口接口返回信息 " + response.msg);
                    var select2Data = [];
                    if(response.data){
                        //console.log("initCarModelConfig() 返回参数正确 ");

                        if(!(carInfoData || carInfoData.modelPhoto)){
                            //若无初始化数据,则通过新获取的数据赋值
                            $("input[name=modelPhoto]").val(response.data.modelPhoto);
                        }
                        if(!(carInfoData || carInfoData.modelPicsHtml)){
                            //若无初始化数据,则通过新获取的数据赋值
                            //错误数据临时处理
                            var modelPicsHtml = response.data.modelPicsHtml;
                            if(modelPicsHtml && modelPicsHtml.endWith("<img src=")){
                                response.data.modelPicsHtml = modelPicsHtml.substring(0, modelPicsHtml.length-"<img src=".length);
                            }
                            $("textarea[name=modelPicsHtml]").html(response.data.modelPicsHtml);
                        }
                        if(!(carInfoData || carInfoData.modelCategory)){
                            //若无初始化数据,则通过新获取的数据赋值
                            $("input[name=modelCategory]").val(response.data.modelCategory);
                        }
                        if(!(carInfoData || carInfoData.referPriceList)){
                            //若无初始化数据,则通过新获取的数据赋值
                            var referPriceList = JSON.parse(response.data.referPriceList);
                            var autoHomePrice = referPriceList[0];
                            var huimaichePrice = referPriceList[1];
                            try {
                                $("input[name=priceCompare_carHome]").val(autoHomePrice.price);
                            }catch(e){
                                printErrormsg("汽车之家数据出错");
                            }
                            try{
                                $("input[name=priceCompare_huiBuyCar]").val(huimaichePrice.price);
                            }catch(e){
                                printErrormsg("惠买车数据出错");
                            }
                        }
                        vinList = {};
                        var firstKey = null;
                        for (var dataIndex in response.data.inventoryList) {
                            if(firstKey == null){
                                firstKey = response.data.inventoryList[dataIndex].vin;
                            }
                            vinList[response.data.inventoryList[dataIndex].vin] = response.data.inventoryList[dataIndex];
                            select2Data.push({
                                id: response.data.inventoryList[dataIndex].vin,
                                text: response.data.inventoryList[dataIndex].vin
                            });
                        }
                        console.log("initCarModelConfig() here1 ");
                        if(vinObj){
                            $(vinObj).unbind("select2:select");
                            $(vinObj).html("");
                            $(vinObj).select2({
                                data: select2Data,
                                placeholder: "请选择车架号",
                                allowClear: emptyValueByDefault
                            }).trigger("change");
                            if(carInfoData && carInfoData.vin){
                                $(vinObj).select2().val(carInfoData.vin).trigger("change");
                                $(vinObj).prop("disabled", true);
                                //console.log("initCarModelConfig() 设置为初始化值val:"+ carInfoData.vin+",并置为不可编辑");
                            } else {
                                if (emptyValueByDefault) {
                                    $(vinObj).select2().val("").trigger("change");
                                    //console.log("initCarModelConfig() 设置空值, val:" + $(vinObj).select2().val());
                                    if (selectCallback && typeof selectCallback == "function") {
                                        selectCallback()
                                    }
                                } else {
                                    vinChange(firstKey);
                                }
                                //console.log("initCarModelConfig() 给vin列表select2绑定事件,当select2改变时,更新相关信息");
                                $(vinObj).on("select2:select", function (e) {
                                    //console.log("vin select2:select ");
                                    var currentVin = $(vinObj).val();
                                    vinChange(currentVin);
                                });
                            }
                        }
                    } else {
                        //console.log("initCarModelConfig() 返回参数错误 ");
                        if(vinObj) {
                            $(vinObj).html("");
                            $(vinObj).select2();
                        }
                        if(selectCallback && typeof selectCallback == "function"){
                            selectCallback()
                        }
                    }
                } else {
                    //console.log("initCarModelConfig() 车款参数接口接口返回信息 " + response.msg);
                }
            },
            error: function (data) {
                printAjaxError(data);
            }
        });
    }
}



/**
 * 车辆商品上、下架。售罄、删除接口接口
 **/
function carStateChangeSold() {
    var requestData = $("#hmc_changCarState").data().rd;
    console.log(requestData);
       $.ajax({
            type: "POST",
            url: soldDsCarOnsaleStateUrl,
            dataType: "json",
            data: requestData,
            success: function (response) {
                if (typeof(response.status) != undefined && response.status == 1) {
                  //  console.log("参数正确 返回信息" + response.msg);
                    onShelfTableReload();
                    offShelfDataTableReload();
                    $(".exampleModal1").click();
                } else {
                    console.log("返回信息" + response.msg);
                    //console.log("返回信息" + response.msg);
                }
            },
            error: function (data) {
                printAjaxError(data);
            }
        });
}


function carStateChangeSold1() {
    var requestData = $("#hmc_changCarState").data().rd;
    console.log(requestData);
    $.ajax({
        type: "POST",
        url: soldDsCarOnsaleStateUrl,
        dataType: "json",
        data: requestData,
        success: function (response) {
            if (typeof(response.status) != undefined && response.status == 1) {
                //console.log("参数正确 返回信息" + response.msg);
                EffectiveStockTableReload();
                soldStockDataTableReload();
                $(".exampleModal1").click();
            } else {
                console.log("返回信息" + response.msg);
                //console.log("返回信息" + response.msg);
            }
        },
        error: function (data) {
            printAjaxError(data);
        }
    });
}



function wormAlertShow(obj, soldState){
    //alert(123);
    $('#hmc_changCarState').data("");
    $("#wromMsg").text("你确定要"+carStateDict[soldState]+"吗?");
    var carId = $(obj).attr("data-targetid");
    var requestData = {
        carId: carId,
        soldState: soldState
    };
    $('#hmc_changCarState').data({"rd":requestData});
}





/**
 * 4S店列表接口
 * @param carBrandObj
 * @param carTypeObj
 * @param carModelObj
 * @param emptyValueByDefault
 */
function getFsList(carBrandObj, carTypeObj, carModelObj, emptyValueByDefault) {
    topBrandId = $(carBrandObj).val();
    var requestData = {topBrandId: topBrandId};
    $.ajax({
        type: "POST",
        url: getFsListUrl,
        dataType: "json",
        data: requestData,
        success: function (response) {
            if (typeof(response.status) != undefined && response.status == 1) {
                //console.log("4S店列表接口返回信息 " + response.msg);
                if(response.data && response.data.length > 0) {
                    var select2Data = [];
                    for (var dataIndex in response.data) {
                        select2Data.push({
                            id: response.data[dataIndex].fsId,
                            text: response.data[dataIndex].fsName
                        });
                    }
                    $("select[name=fsId]").html("");
                    $("select[name=fsId]").select2({data: select2Data}).trigger("change");
                    if(emptyValueByDefault){
                        $("select[name=fsId]").select2().val("").trigger("change");
                    }
                }else{
                    $("select[name=fsId]").html("");
                    $("select[name=fsId]").select2().trigger("change");
                }
            } else {
                //console.log("4S店列表接口返回信息 " + response.msg);
            }
        },
        error: function (data) {
            printAjaxError(data);
        }
    });
}


/**
 * 初始化错误信息方法
 */
function initMsg() {
    $("#hmc_msg_zone").html('\
        <div class="alert alert-block alert-danger fade in hide">\
            <button type="button" class="close close-sm" data-dismiss="alert">\
                <i class="fa fa-times"></i>\
            </button>\
            <strong>错误！</strong> 红色项不能为空\
        </div>');
}






// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
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
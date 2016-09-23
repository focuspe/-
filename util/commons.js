/**
 * Created by qianxuehong on 2016/9/7.
 */

function layout(uid, res, rend) {
    if(uid === "yoda"){
        res.render(rend,{layout:'layout'});
    }
    else{
        res.render(rend,{layout:'layout1'});
    }
}

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
};

module.exports = {
    layout:layout,
    format:format
};
/**
 * 本测试函数取自viewcontroller.js
 * 函数名formattime
 */

/**
 * 格式化时间函数
 *  - 传入时间(单位秒) 返回数组 [hou,min,sec]格式
 *  - 传入数组[hou,min,sec] 返回 字符串格式 [00:]00:00
 * @api private
 */
var formattime = (function () {
    var cacheformin, cacheforhou;
    function getmin(value) {
        cacheformin = Math.floor(value / 60);
        if (cacheformin < 60) {
            return cacheformin;
        } else {
            cacheformin = cacheformin % 60;
            return cacheformin;
        }
    };
    function getsec(value) {
        return value - (cacheforhou * 3600 + cacheformin * 60);
    };
    function gethou(value) {
        if (value < 3600) {
            cacheforhou = 0;
            return 0;
        } else {
            cacheforhou = Math.floor(value / 3600)
            return cacheforhou;
        }
    };
    /**
     * 将传入的数值,变成两位长度的字符串
     * 一位长的数前面补0
     *  **传入的数值必须是整形数,audio.getcurrenttime数组返回的都是整数**
     * @param {number} value 
     * @api private
     */
    function timetostring(value) {
        var cache = value.toString();
        switch (value.toString().length) {
            case 0:
                return '00';
                break;
            case 1:
                return '0' + cache;
                break;
            case 2:
                return cache;
                break;
        }
    };
    return function (value) {
        cacheformin = cacheforhou = 0;
        if (typeof value == 'number') {
            return [gethou(value), getmin(value), getsec(value)];
        } else if (value[0] == 0) {
            return timetostring(value[1]) + ':' + timetostring(value[2]);
        } else if (value[0] != 0) {
            return timetostring(value[0]) + ':' + timetostring(value[1]) + ':' + timetostring(value[2]);
        }
    };
})();

console.log(formattime(3600));
console.log(formattime(formattime(3600)));
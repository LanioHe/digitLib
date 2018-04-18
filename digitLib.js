/**
 * var digitLib = DigitLib();
 *
 * 阿拉伯数字转中文数字,
 * 如果传入数字时则最多处理到21位，超过21位js会自动将数字表示成科学计数法，导致精度丢失和处理出错
 * 传入数字字符串则没有限制
 * @param {number|string} digit
 * digitLib.toZhDigit(digit)
 * 22 => 二十二
 *
 * 中文数字转阿拉伯数字,
 * @param {string} string
 * digitLib.toArabic(string)
 * 二十二 => 22
 *
 * 阿拉伯数字转字母,
 * @param {number|string} digit
 * digitLib.toLetter(digit)
 * 0 => a
 *
 * 阿拉伯数字转大写字母,
 * @param {number|string} digit
 * digitLib.toUpLetter(digit)
 * 0 => A
 *
 * 字母转阿拉伯数字
 * @param {string} letter
 * digitLib.ltToArabic(letter)
 * a/A => 0
 */

(function () {
    // 考虑polyfill情况
    Object.setPrototypeOf = Object.setPrototypeOf ||
        function (obj, proto) {
            obj.__proto__ = proto;
            return obj;
        };

    function DigitLib() {
        return Object.setPrototypeOf({}, DigitLib.prototype);
    }

    DigitLib.prototype.toZhDigit = toZhDigit;
    DigitLib.prototype.toArabic = toArabic;
    DigitLib.prototype.toLetter = toLetter;
    DigitLib.prototype.toUpLetter = toUpLetter;
    DigitLib.prototype.ltToArabic = ltToArabic;

    // 中文数字位数
    var  zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    var  unit = ['千', '百', '十', ''];
    var  quot = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];

    /**
     * 阿拉伯数字转中文数字,
     * 如果传入数字时则最多处理到21位，超过21位js会自动将数字表示成科学计数法，导致精度丢失和处理出错
     * 传入数字字符串则没有限制
     * @param {number|string} digit
     */
    function toZhDigit(digit) {
        digit = typeof digit === 'number' ? String(digit) : digit;

        var breakLen = Math.ceil(digit.length / 4);
        var notBreakSegment = digit.length % 4 || 4;
        var segment;
        var zeroFlag = [], allZeroFlag = [];
        var result = '';

        while (breakLen > 0) {
            if (!result) { // 第一次执行
                segment = digit.slice(0, notBreakSegment);
                var segmentLen = segment.length;
                for (var i = 0; i < segmentLen; i++) {
                    if (segment[i] != 0) {
                        if (zeroFlag.length > 0) {
                            result += '零' + zh[segment[i]] + unit[4 - segmentLen + i];
                            // 判断是否需要加上 quot 单位
                            if (i === segmentLen - 1 && breakLen > 1) {
                                result += quot[breakLen - 2];
                            }
                            zeroFlag.length = 0;
                        } else {
                            result += zh[segment[i]] + unit[4 - segmentLen + i];
                            if (i === segmentLen - 1 && breakLen > 1) {
                                result += quot[breakLen - 2];
                            }
                        }
                    } else {
                        // 处理为 0 的情形
                        if (segmentLen == 1) {
                            result += zh[segment[i]];
                            break;
                        }
                        zeroFlag.push(segment[i]);
                        continue;
                    }
                }
            } else {
                segment = digit.slice(notBreakSegment, notBreakSegment + 4);
                notBreakSegment += 4;

                for (var j = 0; j < segment.length; j++) {
                    if (segment[j] != 0) {
                        if (zeroFlag.length > 0) {
                            // 第一次执行zeroFlag长度不为0，说明上一个分区最后有0待处理
                            if (j === 0) {
                                result += quot[breakLen - 1] + zh[segment[j]] + unit[j];
                            } else {
                                result += '零' + zh[segment[j]] + unit[j];
                            }
                            zeroFlag.length = 0;
                        } else {
                            result += zh[segment[j]] + unit[j];
                        }
                        // 判断是否需要加上 quot 单位
                        if (j === segment.length - 1 && breakLen > 1) {
                            result += quot[breakLen - 2];
                        }
                    } else {
                        // 第一次执行如果zeroFlag长度不为0, 且上一划分不全为0
                        if (j === 0 && zeroFlag.length > 0 && allZeroFlag.length === 0) {
                            result += quot[breakLen - 1];
                            zeroFlag.length = 0;
                            zeroFlag.push(segment[j]);
                        } else if (allZeroFlag.length > 0) {
                            // 执行到最后
                            if (breakLen == 1) {
                                result += '';
                            } else {
                                zeroFlag.length = 0;
                            }
                        } else {
                            zeroFlag.push(segment[j]);
                        }

                        if (j === segment.length - 1 && zeroFlag.length === 4 && breakLen !== 1) {
                            // 如果执行到末尾
                            if (breakLen === 1) {
                                allZeroFlag.length = 0;
                                zeroFlag.length = 0;
                                result += quot[breakLen - 1];
                            } else {
                                allZeroFlag.push(segment[j]);
                            }
                        }
                        continue;
                    }
                }

                --breakLen;
            }

            return result;
        }
    }

    /**
     * 中文数字转阿拉伯数字,
     * @param {string} digit
     */
    function toArabic(digit) {
        var result = 0, quotFlag;

        for (var i = digit.length - 1; i >= 0; i--) {
            if (zh.indexOf(digit[i]) > -1) { // 数字
                if (quotFlag) {
                    result += quotFlag * getNumber(digit[i]);
                } else {
                    result += getNumber(digit[i]);
                }
            } else if (unit.indexOf(digit[i]) > -1) { // 十分位
                if (quotFlag) {
                    result += quotFlag * getUnit(digit[i]) * getNumber(digit[i - 1]);
                } else {
                    result += getUnit(digit[i]) * getNumber(digit[i - 1]);
                }
                --i;
            } else if (quot.indexOf(digit[i]) > -1) { // 万分位
                if (unit.indexOf(digit[i - 1]) > -1) {
                    if (getNumber(digit[i - 1])) {
                        result += getQuot(digit[i]) * getNumber(digit[i - 1]);
                    } else {
                        result += getQuot(digit[i]) * getUnit(digit[i - 1]) * getNumber(digit[i - 2]);
                        quotFlag = getQuot(digit[i]);
                        --i;
                    }
                } else {
                    result += getQuot(digit[i]) * getNumber(digit[i - 1]);
                    quotFlag = getQuot(digit[i]);
                }
                --i;
            }
        }

        return result;

        // 返回中文大写数字对应的阿拉伯数字
        function getNumber(num) {
            for (var i = 0; i < zh.length; i++) {
                if (zh[i] == num) {
                    return i;
                }
            }
        }

        // 取单位
        function getUnit(num) {
            for (var i = unit.length; i > 0; i--) {
                if (num == unit[i - 1]) {
                    return Math.pow(10, 4 - i);
                }
            }
        }

        // 取分段
        function getQuot(q) {
            for (var i = 0; i < quot.length; i++) {
                if (q == quot[i]) {
                    return Math.pow(10, (i + 1) * 4);
                }
            }
        }
    }

    /**
     * 阿拉伯数字转字母
     * @param {number|string} digit
     */
    function toLetter(digit) {
        return String.fromCharCode(94 + digit * 1);
    }

    /**
     * 阿拉伯数字转大写字母
     * @param {number|string} digit
     */
    function toUpLetter(digit) {
        return String.fromCharCode(65 + digit * 1);
    }

    /**
     * 字母转阿拉伯数字
     * @param {string} letter
     */
    function ltToArabic(letter) {
        return letter.toLowerCase().charCodeAt(0) - 97
    }

    this.DigitLib = DigitLib;
})();

DigitLib 阿拉伯数字与中文数字的转换、阿拉伯数字与中文数字的转换

###
var digitLib = DigitLib();

阿拉伯数字转中文数字,
如果传入数字时则最多处理到21位，超过21位js会自动将数字表示成科学计数法，导致精度丢失和处理出错
传入数字字符串则没有限制
@param {number|string} digit
digitLib.toZhDigit(digit)
22 => 二十二

中文数字转阿拉伯数字,
@param {string} string
digitLib.toArabic(string)
二十二 => 22

阿拉伯数字转字母,
@param {number|string} digit
digitLib.toLetter(digit)
0 => a

阿拉伯数字转大写字母,
@param {number|string} digit
digitLib.toUpLetter(digit)
0 => A

字母转阿拉伯数字
@param {string} letter
digitLib.ltToArabic(letter)
a/A => 0


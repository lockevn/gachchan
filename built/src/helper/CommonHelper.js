"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var intersection_1 = require("lodash/intersection");
var intersectionWith_1 = require("lodash/intersectionWith");
var isNumber_1 = require("lodash/isNumber");
var flatten_1 = require("lodash/flatten");
var Decimal = require("decimal.js");
var CommonHelper = /** @class */ (function () {
    function CommonHelper() {
    }
    /**
     * @deprecated use ToNumber() TODO: remove this
     */
    CommonHelper.ToActualNumber = function (val) {
        return CommonHelper.ToNumber(val);
    };
    /**
     * @deprecated use ToNumber() TODO: remove this
     */
    CommonHelper.FormatNumber = function (numberString, fractationDigits) {
        if (fractationDigits === void 0) { fractationDigits = 0; }
        return CommonHelper.ToNumber(numberString, fractationDigits);
    };
    /**
     * if provide a number or number-string, this will return a number, with fractationDigits
     * if provided a string ("AT, ATC, ATO") throw exception
     * NonNumberValue like null, undefined and NaN is treat as 0
     * @param {string} numberString
     * @param {number} fractationDigits number of decimal digit
     * @param {*} treatNonNumberValueAs
     * @returns number
     */
    CommonHelper.ToNumber = function (numberString, fractationDigits, treatNonNumberValueAs) {
        if (treatNonNumberValueAs === void 0) { treatNonNumberValueAs = 0; }
        var ret = treatNonNumberValueAs;
        var convertedToNumberVal = +numberString;
        // note that isNumber(NaN) == true
        if ((0, isNumber_1.default)(convertedToNumberVal) && !isNaN(convertedToNumberVal)) {
            ret = convertedToNumberVal;
        }
        if (fractationDigits !== undefined) {
            ret = new Decimal(ret).toDP(fractationDigits).toNumber();
        }
        return ret;
    };
    /**
     * Continuously call actionFn by setTimeout with interval. The next process will be schedule after current process completed (success or failed)
     * Interval can be determined (randomly) by intervalFn() and delay betwen execution can be vary.
     * @param {*} actionFn support async function
     * @param {*} DEFAULT_INTERVAL if nothing provided or callbackFn success, this is the interval for running. If adjustment happen, it will not exceed 2*DEFAULT_INTERVAL
     * @param {*} intervalFn intervalFn(currentDelay, isPreviousRunSuccess). if currentDelay is undefined, should return the default. if currentDelay has value, should return next delay.
     */
    CommonHelper.ContinuousExecuteBySetTimeout = function (actionFn, DEFAULT_INTERVAL, intervalFn) {
        if (DEFAULT_INTERVAL === void 0) { DEFAULT_INTERVAL = 10000; }
        if (!actionFn || typeof actionFn != "function") {
            return;
        }
        // use the default intervalFn
        if (typeof intervalFn != "function") {
            intervalFn = CommonHelper.ContinuousExecuteBySetTimeoutDefaultIntervalFn;
        }
        var delay = intervalFn(undefined, true, DEFAULT_INTERVAL);
        var isPreviousRunSuccess = true;
        var ret = {
            timerId: -1,
            delay: delay,
        };
        function run() {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, actionFn()];
                        case 1:
                            _a.sent();
                            isPreviousRunSuccess = true;
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            isPreviousRunSuccess = false;
                            return [3 /*break*/, 3];
                        case 3:
                            // calculate the new delay for the next run
                            delay = intervalFn(delay, isPreviousRunSuccess, DEFAULT_INTERVAL);
                            ret.delay = delay;
                            ret.timerId = setTimeout(run, delay);
                            return [2 /*return*/];
                    }
                });
            });
        }
        ret.timerId = setTimeout(run, delay);
        // console.debug(`${ret.delay} ${ret.timerId} after setTimeout -------- INIT`)
        return ret;
    };
    /**
     * create a default function/behaviour, calculate delay based on previous delay and isPreviousRunSuccess.
     * When calling ContinuousExecuteBySetTimeout() without intervalFn, this func will be used as default implementation
     * @param {*} previousDelay
     * @param {*} isPreviousRunSuccess
     * @returns
     */
    CommonHelper.ContinuousExecuteBySetTimeoutDefaultIntervalFn = function (previousDelay, isPreviousRunSuccess, DEFAULT_INTERVAL) {
        if (isPreviousRunSuccess) {
            return DEFAULT_INTERVAL; // job is done successfully, we back to use DEFAULT_INTERVAL (because prev delay (which is a failed one) can be (e.g. 12345ms), longer than DEFAULT_INTERVAL)
        }
        // adjust delay to be longer than previousDelay, but maximum is 2 * DEFAULT_INTERVAL
        var newDelay = previousDelay || DEFAULT_INTERVAL;
        // increase delay, at least 20%
        newDelay = Math.round(newDelay * (1.2 + Math.random()));
        if (newDelay > 2 * DEFAULT_INTERVAL) {
            newDelay = 2 * DEFAULT_INTERVAL;
        }
        // console.debug("change to different newDelay for next request:", newDelay)
        return newDelay;
    };
    /**
     * change 1 to 1️⃣ (unicode square box character)
     * @param {*} numberString
     * @returns string
     */
    CommonHelper.RepresentNumberInIconicDigit = function (numberString) {
        if (!numberString) {
            return "";
        }
        var ret = numberString.toString();
        ret = ret
            .replace("0", "0️⃣")
            .replace("1", "1️⃣")
            .replace("2", "2️⃣")
            .replace("3", "3️⃣")
            .replace("4", "4️⃣")
            .replace("5", "5️⃣")
            .replace("6", "6️⃣")
            .replace("7", "7️⃣")
            .replace("8", "8️⃣")
            .replace("9", "9️⃣");
        return ret;
    };
    /**
     * if now is 14:22, this return 1422.
     * 9:40AM ==> 0940
     * 16:03 (PM) ==> 1603
     * @param {Date} date
     * @returns
     */
    CommonHelper.GetCurrentHoursMinutesString = function (date) {
        if (!date)
            date = new Date();
        var currentHoursMinutesString = date
            .getHours()
            .toString()
            .padStart(2, 0) +
            "" +
            date
                .getMinutes()
                .toString()
                .padStart(2, 0);
        return currentHoursMinutesString;
    };
    /**
     * if now is 14:22:59, this return 142259.
     * 9:40AM ==> 094000
     * 16:03 (PM) ==> 160300
     */
    CommonHelper.GetCurrentHoursMinutesSecondsString = function (date) {
        if (!date)
            date = new Date();
        var ret = CommonHelper.GetCurrentHoursMinutesString(date) +
            date
                .getSeconds()
                .toString()
                .padStart(2, 0);
        return ret;
    };
    /**
     * return current date time in full format, in specific culture (language) and timezone
     * @param {*} culture
     * @param {*} timezone
     * @returns
     */
    CommonHelper.GetDatetimeNowString = function (culture, timezone) {
        if (culture === void 0) { culture = "vi-VN"; }
        if (timezone === void 0) { timezone = "Asia/Saigon"; }
        return new Intl.DateTimeFormat(culture, { timezone: timezone, dateStyle: "full", timeStyle: "long", hour12: false }).format(new Date());
        // _calculatedCWData_lastUpdated = new Date().toLocaleString("vi-VN", { timezone: "Asia/Saigon", hour12: false })
    };
    /**
     * random an int number, maximum is max - 1. Max = 10, so return 0 to 10
     * @param {*} max
     * @returns number integer
     */
    CommonHelper.GetRandomIntegerTo = function (max) {
        return Math.round(Math.random() * max);
    };
    /**
     * return random element inside array
     * @param {*} arr
     * @returns
     */
    CommonHelper.GetRandomArrayElement = function (arr) {
        if (Array.isArray(arr)) {
            return arr[CommonHelper.GetRandomIntegerTo(arr.length - 1)];
        }
    };
    /**
     * check for intersection.
     * E.g.: [a,b,c], a ==> true
     * E.g.: [a,b,c], [a] ==> true
     * E.g.: [a,b,c], [A], true ==> true, a==A because of ignoreCase
     *
     * value (which is not string) is compared by === (null === null, undefined === undefined)
     * @param {*} firstList
     * @param {*} otherList accept single value or array
     * @param {*} ignoreCase for string value (of either side), ignore case when comparing
     * @returns boolean true if there is an intersection
     */
    CommonHelper.HasAnyOfIntersection = function (firstList, otherList, ignoreCase) {
        if (otherList === void 0) { otherList = ""; }
        if (ignoreCase === void 0) { ignoreCase = true; }
        if (!firstList || !otherList)
            return false;
        var arrFirsts = (0, flatten_1.default)([firstList]); // [""]   ==> [""], [[1,2]]   ==> [1,2]
        var arrEvaluations = (0, flatten_1.default)([otherList]); // [""]   ==> [""], [[1,2]]   ==> [1,2]
        var ret;
        if (ignoreCase) {
            ret =
                (0, intersectionWith_1.default)(arrFirsts, arrEvaluations, function (listVal, otherVal) {
                    var _a, _b;
                    if (typeof listVal === "string" || typeof otherVal === "string") {
                        return ((_a = listVal === null || listVal === void 0 ? void 0 : listVal.toString()) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === ((_b = otherVal === null || otherVal === void 0 ? void 0 : otherVal.toString()) === null || _b === void 0 ? void 0 : _b.toUpperCase());
                    }
                    return listVal === otherVal;
                }).length > 0;
        }
        else {
            ret = (0, intersection_1.default)(arrFirsts, arrEvaluations).length > 0;
        }
        return ret;
    };
    /**
     * return percent of portion to full, 25 50 ==> 50
     * @param {*} portion
     * @param {*} full
     * @param {*} fractationDigits
     * @returns number
     */
    CommonHelper.Percent = function (portion, full, fractationDigits) {
        var ret = (100 * portion) / full;
        if (fractationDigits > 0) {
            ret = CommonHelper.FormatNumber(ret, fractationDigits);
        }
        return ret;
    };
    /**
     * from 100 to 110, the diff is 10, and is 10%. Return 10
     * @param {*} from
     * @param {*} to
     * @returns null if from to is not number
     */
    CommonHelper.DiffInPercent = function (from, to, fractationDigits) {
        var ret = null;
        if ((0, isNumber_1.default)(from) && (0, isNumber_1.default)(to)) {
            ret = CommonHelper.Percent(to - from, from, fractationDigits);
        }
        return ret;
    };
    // =========== ===================== ===========
    // =========== string representation ===========
    // =========== ===================== ===========
    /**
     * join all arguments with "/" seperator.
     * E.g.: JoinPaths("a", b, c)
     * @returns String
     */
    CommonHelper.JoinPaths = function () {
        var parts = Array.prototype.slice.call(arguments); // make array from arguments
        var separator = "/";
        var replace = new RegExp(separator + "{1,}", "g");
        return parts.join(separator).replace(replace, separator);
    };
    /**
     * empty string, null, NaN, undefined return ""
     *  or text string which is not a number, return ""
     * format number to string (usage of PercentValueFormatter can use this)
     * @param {*} val
     * @param {*} fractationDigits
     * @param {*} showPrefixSign
     * @returns string
     */
    CommonHelper.ToNumberString = function (val, fractationDigits, showPrefixSign, showZeroVal, suffix) {
        if (fractationDigits === void 0) { fractationDigits = 2; }
        if (showPrefixSign === void 0) { showPrefixSign = false; }
        if (showZeroVal === void 0) { showZeroVal = true; }
        if (suffix === void 0) { suffix = ""; }
        if (val == 0 && !showZeroVal) {
            return "";
        }
        if (!val && val !== 0) {
            // NaN, undefined, null, ""
            return "";
        }
        var prefixSign = showPrefixSign && val > 0 ? "+" : "";
        return prefixSign + CommonHelper.FormatNumber(val, fractationDigits) + suffix;
    };
    /**
     * display 1000000 as 1tr, 1000 as 1k
     * Also round the number after converting (100400 ==> 100k, 100500 ==> 101k)
     * vi-VN default thounsand separator is ,
     * 0 will be returned as "0"
     * NaN or "" will be returned as ""
     * "ATC" (which is cannot be converted to number) will be returned as as "ATC"
     * @param {number | string} numberString original number (string) to format. This string must be able to convert to number.
     * @param {number} unitDividen dividen divide number to this
     * @param {number} fractationDigits default is 0 (1000 --> 1,000). if 1, 1000,1 --> 1,000.1
     * @param {string} unit default is "tr" (triệu đồng VN)
     * @param {string} locale "en-US" "vi-VN"
     * @returns string
     */
    CommonHelper.NumberToUnitString = function (numberString, unitDividen, fractationDigits, unit, locale) {
        if (unitDividen === void 0) { unitDividen = 1; }
        if (fractationDigits === void 0) { fractationDigits = 0; }
        if (unit === void 0) { unit = ""; }
        if (locale === void 0) { locale = "en-US"; }
        // empty string, or text string which is not a number, return
        if (numberString === 0)
            return "0";
        if (!numberString)
            return "";
        if (!+numberString)
            return numberString === null || numberString === void 0 ? void 0 : numberString.toString();
        var unitNumbers = (+numberString / unitDividen).toFixed(fractationDigits);
        return new Intl.NumberFormat(locale).format(+unitNumbers) + unit;
    };
    // =========== ===================== ===========
    // =========== string representation ===========
    // =========== ===================== ===========
    /**
     * @deprecated use ToNumber()
     * Round number to 2 digit. 1.22222 => 1.22
     * @param {*} num
     */
    CommonHelper.roundToTwo = function (num) {
        return CommonHelper.ToNumber(num, 2);
    };
    return CommonHelper;
}());
exports.default = CommonHelper;

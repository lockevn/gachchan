"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default,
  foo: () => foo
});
module.exports = __toCommonJS(src_exports);

// src/helper/CommonHelper.ts
var import_intersection = __toESM(require("lodash/intersection"));
var import_intersectionWith = __toESM(require("lodash/intersectionWith"));
var import_isNumber = __toESM(require("lodash/isNumber"));
var import_flatten = __toESM(require("lodash/flatten"));
var Decimal = require("decimal.js");
var CommonHelper = class {
  /**
   * @deprecated use ToNumber() TODO: remove this
   */
  static ToActualNumber(val) {
    return CommonHelper.ToNumber(val);
  }
  /**
   * @deprecated use ToNumber() TODO: remove this
   */
  static FormatNumber(numberString, fractationDigits = 0) {
    return CommonHelper.ToNumber(numberString, fractationDigits);
  }
  /**
   * if provide a number or number-string, this will return a number, with fractationDigits
   * if provided a string ("AT, ATC, ATO") throw exception
   * NonNumberValue like null, undefined and NaN is treat as 0
   * @param {string} numberString
   * @param {number} fractationDigits number of decimal digit
   * @param {*} treatNonNumberValueAs
   * @returns number
   */
  static ToNumber(numberString, fractationDigits, treatNonNumberValueAs = 0) {
    let ret = treatNonNumberValueAs;
    const convertedToNumberVal = +numberString;
    if ((0, import_isNumber.default)(convertedToNumberVal) && !isNaN(convertedToNumberVal)) {
      ret = convertedToNumberVal;
    }
    if (fractationDigits !== void 0) {
      ret = new Decimal(ret).toDP(fractationDigits).toNumber();
    }
    return ret;
  }
  /**
   * round value to X decimal places https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
   * 19.103857566765578635.toBe(19.1)
   * 19.143857566765578635.toBe(19.1)
   * 19.144857566765578635.toBe(19.1)
   * @param {*} value
   * @returns
   */
  static RoundNumber(value, decimalPlaces = 1) {
    const decimalPlacesMultiplier = Math.pow(10, decimalPlaces);
    return Math.round((value + Number.EPSILON) * decimalPlacesMultiplier) / decimalPlacesMultiplier;
  }
  /**
   * Continuously call actionFn by setTimeout with interval. The next process will be schedule after current process completed (success or failed)
   * Interval can be determined (randomly) by intervalFn() and delay between execution can be vary.
   * @param {Function} actionFn support async function
   * @param {Number} DEFAULT_INTERVAL if nothing provided or callbackFn success, this is the interval for running. If adjustment happen, it will not exceed 2*DEFAULT_INTERVAL
   * @param {Function} intervalFn intervalFn(currentDelay, isPreviousRunSuccess, DEFAULT_INTERVAL). if currentDelay is undefined, should return the default. if currentDelay has value, should return next delay.
   * @param {Boolean} executeImmediately if true, invoke actionFn() immediately (in the beginning) when calling this function
   * @param {Function} shouldPerformActionFn shouldPerformActionFn(currentDelay, isPreviousRunSuccess, DEFAULT_INTERVAL). this function should return true if you want to perform actionFn when timeout happen.
   */
  static async ContinuousExecuteBySetTimeout(actionFn, DEFAULT_INTERVAL = 1e4, intervalFn = void 0, executeImmediately = false, shouldPerformActionFn = () => true) {
    if (!actionFn || typeof actionFn != "function") {
      return {};
    }
    if (typeof intervalFn != "function") {
      intervalFn = CommonHelper.ContinuousExecuteBySetTimeoutDefaultIntervalFn;
    }
    let delay = intervalFn(void 0, void 0, DEFAULT_INTERVAL);
    let isPreviousRunSuccess = void 0;
    let ret = {
      timerId: void 0,
      delay
    };
    async function run() {
      try {
        if (shouldPerformActionFn(delay, isPreviousRunSuccess, DEFAULT_INTERVAL)) {
          await actionFn();
          isPreviousRunSuccess = true;
        }
      } catch (error) {
        isPreviousRunSuccess = false;
      }
      delay = intervalFn(delay, isPreviousRunSuccess, DEFAULT_INTERVAL);
      ret.delay = delay;
      ret.timerId = setTimeout(run, delay);
    }
    if (executeImmediately && shouldPerformActionFn(delay, isPreviousRunSuccess, DEFAULT_INTERVAL)) {
      try {
        await actionFn();
        isPreviousRunSuccess = true;
      } catch (error) {
        isPreviousRunSuccess = false;
      }
    }
    ret.timerId = setTimeout(run, delay);
    return ret;
  }
  /**
   * create a default function/behaviour, calculate delay based on previous delay and isPreviousRunSuccess.
   * When calling ContinuousExecuteBySetTimeout() without intervalFn, this func will be used as default implementation
   * @param {*} previousDelay
   * @param {*} isPreviousRunSuccess
   * @returns
   */
  static ContinuousExecuteBySetTimeoutDefaultIntervalFn(previousDelay, isPreviousRunSuccess, DEFAULT_INTERVAL) {
    if (isPreviousRunSuccess) {
      return DEFAULT_INTERVAL;
    }
    let newDelay = previousDelay || DEFAULT_INTERVAL;
    newDelay = Math.round(newDelay * (1.2 + Math.random()));
    if (newDelay > 2 * DEFAULT_INTERVAL) {
      newDelay = 2 * DEFAULT_INTERVAL;
    }
    return newDelay;
  }
  /**
   * change 1 to 1️⃣ (unicode square box character)
   * @param {*} numberString
   * @returns {string}
   */
  static RepresentNumberInIconicDigit(numberString) {
    if (!numberString) {
      return "";
    }
    let ret = numberString.toString();
    ret = ret.replace(/0/g, "0\uFE0F\u20E3").replace(/1/g, "1\uFE0F\u20E3").replace(/2/g, "2\uFE0F\u20E3").replace(/3/g, "3\uFE0F\u20E3").replace(/4/g, "4\uFE0F\u20E3").replace(/5/g, "5\uFE0F\u20E3").replace(/6/g, "6\uFE0F\u20E3").replace(/7/g, "7\uFE0F\u20E3").replace(/8/g, "8\uFE0F\u20E3").replace(/9/g, "9\uFE0F\u20E3");
    return ret;
  }
  /**
   * if now is 2002 12 31 14:22, this return 20021231.
   * @param {Date} date
   * @returns {string}
   */
  static GetCurrentYearMonthDayString(date) {
    if (!date)
      date = /* @__PURE__ */ new Date();
    let ret = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, "0") + date.getDate().toString().padStart(2, "0");
    return ret;
  }
  /**
   * if now is 14:22, this return 1422.
   * 9:40AM ==> 0940
   * 16:03 (PM) ==> 1603
   * @param {Date} date
   * @returns {string}
   */
  static GetCurrentHoursMinutesString(date) {
    if (!date)
      date = /* @__PURE__ */ new Date();
    let currentHoursMinutesString = date.getHours().toString().padStart(2, "0") + "" + date.getMinutes().toString().padStart(2, "0");
    return currentHoursMinutesString;
  }
  /**
   * if now is 14:22:59, this return 142259.
   * 9:40AM ==> 094000
   * 16:03 (PM) ==> 160300
   */
  static GetCurrentHoursMinutesSecondsString(date) {
    if (!date)
      date = /* @__PURE__ */ new Date();
    let ret = CommonHelper.GetCurrentHoursMinutesString(date) + date.getSeconds().toString().padStart(2, "0");
    return ret;
  }
  /**
   *
   * @returns string the Date string in format yyyyMMdd (in UTC timezone)
   */
  static GetCurrentYearMonthDayStringUTC(date) {
    if (!date)
      date = /* @__PURE__ */ new Date();
    return date.toISOString().substring(0, 10).replace(/-/g, "");
  }
  /**
   *
   * @returns string the Time string in format HHmm (in UTC timezone)
   */
  static GetCurrentHoursMinutesStringUTC(date) {
    if (!date)
      date = /* @__PURE__ */ new Date();
    return date.toISOString().substring(11, 16).replace(/:/g, "");
  }
  /**
   *
   * @returns string the Time string in format HHmmss (in UTC timezone)
   */
  static GetCurrentHoursMinutesSecondsStringUTC(date) {
    if (!date)
      date = /* @__PURE__ */ new Date();
    return date.toISOString().substring(11, 19).replace(/:/g, "");
  }
  /**
   * return current date time in full format, in specific culture (language) and timezone
   * @param {*} culture
   * @param {*} timezone
   * @returns
   */
  static GetDatetimeNowString(culture = "vi-VN", timezone = "Asia/Saigon") {
    return new Intl.DateTimeFormat(culture, { timezone, dateStyle: "full", timeStyle: "long", hour12: false }).format(/* @__PURE__ */ new Date());
  }
  /**
   * random an int number, maximum is max - 1. Max = 10, so return 0 to 10
   * @param {*} max
   * @returns number integer
   */
  static GetRandomIntegerTo(max) {
    return Math.round(Math.random() * max);
  }
  /**
   * return random element inside array
   * @param {*} arr
   * @returns
   */
  static GetRandomArrayElement(arr) {
    if (Array.isArray(arr)) {
      return arr[CommonHelper.GetRandomIntegerTo(arr.length - 1)];
    }
  }
  /**
   * This will modify the input array https://stackoverflow.com/a/2450976
   * @param {*} array
   * @returns
   */
  static ShuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }
  /**
   * check for intersection of number or string
   * E.g.: [1,2,3], 2 ==> true
   * E.g.: ["a","b","c"], ["a"] ==> true
   * E.g.: ["a","b","c"], ["A"], true ==> true, a==A because of ignoreCase
   *
   * value (which is not string) is compared by === (null === null, undefined === undefined)
   * @param {number|string|number[]|string[]} firstList
   * @param {number|string|number[]|string[]} otherList accept single value or array
   * @param {boolean} ignoreCase if any value is string, cast either values of firstList and otherList toString(), then compare ignore case
   * @returns boolean true if there is an intersection
   */
  static HasAnyOfIntersection(firstList, otherList = "", ignoreCase = true) {
    if (!firstList || !otherList)
      return false;
    const arrFirsts = (0, import_flatten.default)([firstList]);
    const arrEvaluations = (0, import_flatten.default)([otherList]);
    let ret;
    if (ignoreCase) {
      ret = (0, import_intersectionWith.default)(arrFirsts, arrEvaluations, (listVal, otherVal) => {
        if (typeof listVal === "string" || typeof otherVal === "string") {
          return listVal?.toString()?.toUpperCase() === otherVal?.toString()?.toUpperCase();
        }
        return listVal === otherVal;
      }).length > 0;
    } else {
      ret = (0, import_intersection.default)(arrFirsts, arrEvaluations).length > 0;
    }
    return ret;
  }
  /**
   * return percent of portion to full, 25 50 ==> 50
   * @param {*} portion
   * @param {*} full
   * @param {*} fractationDigits
   * @returns number
   */
  static Percent(portion, full, fractationDigits) {
    let ret = 100 * portion / full;
    if (fractationDigits > 0) {
      ret = CommonHelper.FormatNumber(ret, fractationDigits);
    }
    return ret;
  }
  /**
   * from 100 to 110, the diff is 10, and is 10%. Return 10
   * @param {*} from
   * @param {*} to
   * @returns null if from to is not number
   */
  static DiffInPercent(from, to, fractationDigits) {
    let ret = null;
    if ((0, import_isNumber.default)(from) && (0, import_isNumber.default)(to)) {
      ret = CommonHelper.Percent(to - from, from, fractationDigits);
    }
    return ret;
  }
  // =========== ===================== ===========
  // =========== string representation ===========
  // =========== ===================== ===========
  /**
   * join all arguments with "/" seperator.
   * E.g.: JoinPaths("a", b, c)
   * @returns String
   */
  static JoinPaths() {
    const parts = Array.prototype.slice.call(arguments);
    var separator = "/";
    var replace = new RegExp(separator + "{1,}", "g");
    return parts.join(separator).replace(replace, separator);
  }
  // =========== ===================== ===========
  // =========== string representation ===========
  // =========== ===================== ===========
  /**
   * empty string, null, NaN, undefined return ""
   *  or text string which is not a number, return ""
   * format number to string (usage of PercentValueFormatter can use this)
   * @param {*} val
   * @param {*} fractationDigits
   * @param {*} showPrefixSign
   * @returns string
   */
  static ToNumberString(val, fractationDigits = 2, showPrefixSign = false, showZeroVal = true, suffix = "") {
    if (val == 0 && !showZeroVal) {
      return "";
    }
    if (!val && val !== 0) {
      return "";
    }
    const prefixSign = showPrefixSign && val > 0 ? "+" : "";
    return prefixSign + CommonHelper.FormatNumber(val, fractationDigits) + suffix;
  }
  /**
   * display 1000000 as 1tr, 1000 as 1k
   * display 1000000 as 1,000,000 (when using en-US locale)
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
  static NumberToUnitString(numberString, unitDividen = 1, fractationDigits = 0, unit = "", locale = "en-US") {
    if (numberString === 0)
      return "0";
    if (!numberString)
      return "";
    if (!+numberString)
      return numberString?.toString();
    let unitNumbers = (+numberString / unitDividen).toFixed(fractationDigits);
    return new Intl.NumberFormat(locale).format(+unitNumbers) + unit;
  }
};

// src/helper/StockvnHelper.ts
var StockvnHelper = class {
  /**
   * StockCompany usually represent 1000000 (1 million) as 1,000,000
   * We need to convert it to 1000000
   * @param {*} numberString
   */
  static StandardizeVolNumber(numberString) {
    if (typeof numberString === "number") {
      return numberString;
    }
    if (!numberString) {
      return numberString;
    }
    let ret;
    if (typeof numberString === "string") {
      ret = numberString.replace(/,/g, "");
    }
    return CommonHelper.ToNumber(ret);
  }
  /**
   * continuous checkWorkingHours and call callbackFn with interval
   * @param {*} callbackFn
   * @param {*} interval
   */
  static ContinuousExecuteInWorkingHours(callbackFn, interval) {
    if (!callbackFn) {
      return;
    }
    let timerId = setInterval(async () => {
      if (this.IsInWorkingHours() && this.IsInWorkingDays()) {
        await callbackFn();
      } else {
      }
    }, interval);
    return timerId;
  }
  /**
   * from "now", if in working day, get hhmm time in hhmm format, like "1130" or "0959", then check
   * @param {Date} now
   * @returns boolean
   */
  static IsInWorkingHours(now) {
    if (!now) {
      now = /* @__PURE__ */ new Date();
    }
    if (!StockvnHelper.IsInWorkingDays(now))
      return false;
    const hhmm = CommonHelper.GetCurrentHoursMinutesString(now);
    if ("0845" <= hhmm && hhmm <= "1130" || "1300" <= hhmm && hhmm <= "1445") {
      return true;
    } else {
      return false;
    }
  }
  /**
   *  is in ATO sessions
   * @param {String} now hhhmm string, like "1130" or "0959"
   */
  static IsIn_ATO_Sessions(now) {
    if (!now) {
      now = CommonHelper.GetCurrentHoursMinutesString();
    }
    if ("0845" <= now && now <= "0915") {
      return true;
    }
    return false;
  }
  /**
   *  is in ATC sessions
   * @param {String} now hhhmm string, like "1130" or "0959"
   */
  static IsIn_ATC_Sessions(now) {
    if (!now) {
      now = CommonHelper.GetCurrentHoursMinutesString();
    }
    if ("1430" <= now && now <= "1445") {
      return true;
    }
    return false;
  }
  /**
   * return true if current moment is Monday to Friday
   * @param {Date} now
   */
  static IsInWorkingDays(now) {
    if (!now) {
      now = /* @__PURE__ */ new Date();
    }
    let currentDay = now.getDay();
    if (0 < currentDay && currentDay < 6) {
      return true;
    } else {
      return false;
    }
  }
};

// src/helper/AuthHelper.ts
var AuthHelper = class {
  // if there is a constructor present in subclass, it needs to first call super() before using "this".
  constructor() {
  }
  static get ADMINROLE() {
    return "admin";
  }
  /**
   * merge 2 arrays of roles and reduce to distinct
   * [1,2,3] & [2, 3, 4] ==> return [1,2,3,4]
   * @param {Array} arr1
   * @param {Array} arr2
   */
  static mergeRoles(arr1, arr2) {
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    let distinctArrayOfRoles = arr1.concat(arr2).filter(onlyUnique);
    return distinctArrayOfRoles;
  }
  /**
   * return array of accepted roles. Admin (this.ADMINROLE) will have all roles accepted.
   * Examples: given "crm,advisor", if user has "crm", this returns [crm] only
   * given "crm,advisor", if user has "admin", this returns [crm,advisor]
   *
   * @param {String} requireRoles required roles, to say user is qualified
   * @param {[String]} userRoles roles of user, to validate with requireRoles
   * @returns {[String]} array of satisfy roles
   */
  static hasRoles(requireRoles, userRoles) {
    let arrRet = [];
    if (!requireRoles || !userRoles || !Array.isArray(userRoles)) {
      return arrRet;
    }
    const arrStringRoles = requireRoles.split(",").map((r) => r.trim());
    if (userRoles.indexOf(this.ADMINROLE) >= 0) {
      arrRet = arrStringRoles;
      return arrRet;
    }
    for (let roleToCheck of arrStringRoles) {
      if (userRoles.indexOf(roleToCheck) >= 0) {
        arrRet.push(roleToCheck);
      }
    }
    return arrRet;
  }
  // end func
};

// src/helper/Util.ts
var Util = class {
  /**
   *
   * @param {*} min
   * @param {*} max
   */
  static GetRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  /**
   * split string into array, remove empty entries, each output string is trimmed
   * "1,2,3 ,,, 4, 5 ,6" ==> [1,2,3,4,5,6]
   * @param {*} strCommaSeparated
   */
  static splitByCommaAndTrim(strCommaSeparated) {
    if (strCommaSeparated) {
      return strCommaSeparated.split(",").filter((segment) => segment).map((e) => e.trim());
    } else {
      return [];
    }
  }
  /**
   * merge 2 arrays of entries and reduce to distinct
   * [1,2,3] & [2, 3, 4] ==> return [1,2,3,4]
   * @param {Array} arr1
   * @param {Array} arr2
   */
  static mergeAndDistinct(arr1, arr2) {
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    let distinctArrayOfRoles = arr1.concat(arr2).filter(onlyUnique);
    return distinctArrayOfRoles;
  }
  /**
   * give you the Date object, from the jsonDateString (return from some API services)
   * @param {String} jsonDateString string of this format "/Date(2342353453434)/"
   */
  static parseJsonDate(jsonDateString) {
    return new Date(parseInt(jsonDateString.replace("/Date(", "").replace(")/", "")));
  }
  /**
   * Joins path segments.  Preserves initial "/" and resolves ".." and "."
   * Does not support using ".." to go above/outside the root.
   * This means that join("foo", "../../bar") will not resolve to "../bar"
   */
  static joinPath() {
    var parts = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
      parts = parts.concat(arguments[i].split("/"));
    }
    var newParts = [];
    for (i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];
      if (!part || part === ".")
        continue;
      if (part === "..")
        newParts.pop();
      else
        newParts.push(part);
    }
    if (parts[0] === "")
      newParts.unshift("");
    return newParts.join("/") || (newParts.length ? "/" : ".");
  }
  /**
   * A simple function to get the dirname of a path
   * Trailing slashes are ignored. Leading slash is preserved.
   * @param {*} path
   */
  static dirname(path) {
    return join(path, "..");
  }
};

// src/helper/HtmlHelper.ts
var HtmlHelper = class {
  /**
   *
   * @param {string} bodyHtml
   * @param {string[]} tags [style, script, svg]
   * @returns
   */
  static cleanupHtmlTags(bodyHtml, tags) {
    const tagRegExp = new RegExp(`<(${tags.join("|")})[^>]*>.*?<\\/\\1>`, "igms");
    return bodyHtml.replace(tagRegExp, "");
  }
};

// src/helper/ReactiveSymbolHistoryStore.ts
var import_lodash = __toESM(require("lodash"));
var ReactiveSymbolHistoryStore = class {
  /**
   * run every 30 seconds, to clear the state cache. It's up to the handler to decide clear what and when.
   * By default, it does nothing.
   * @param {*} ReactiveStore the current Store instance
   */
  cacheInvalidator(ReactiveStore) {
  }
  /**
   * VIRTUAL: How to get the ref to the vietnamStock on Firebase
   */
  get_fb$VietnamStock() {
  }
  /**
   * VIRTUAL:
   */
  async getLatestPrices_HTTP_Once() {
  }
  /**
   * VIRTUAL: load OLHC from remote service
   * @param {*} symbolCategory
   * @param {*} symbolId
   * @param {*} tickPeriod
   * @param {*} limitLength
   */
  async listSymbolHistory(symbolCategory, symbolId, tickPeriod = "1D", limitLength = 660) {
  }
  constructor() {
    this.state = {
      // AAA : {
      //   symbolCategory: "VietnamStock",
      //   pricesOHLCExtended:
      // [{open, high, low, close, ts, v }]
      // }
    };
    this.fb$vietnamStock = null;
    this.interval_cacheInvalidator = 3e4;
    this.interval_syncAllLatestPricesAtOnce = 6e4;
  }
  /**
   * Init this Store, setup func, call func from Virtual methods, start all the interval
   */
  init() {
    this.fb$vietnamStock = this.get_fb$VietnamStock();
    if (import_lodash.default.isEmpty(this.fb$vietnamStock) == false && this.fb$vietnamStock.on) {
      this.fb$vietnamStock.on("child_changed", (snapshot) => {
        this.mergeLatestPriceToStore(
          {
            [snapshot.key]: snapshot.val()
          },
          this.state
        );
      });
    }
    setInterval(async () => {
      const dataLatestPrices_AllSymbols = await this.getLatestPrices_HTTP_Once();
      this.mergeLatestPriceToStore(dataLatestPrices_AllSymbols, this.state);
    }, this.interval_syncAllLatestPricesAtOnce);
    setInterval(() => {
      if (this.cacheInvalidator) {
        this.cacheInvalidator();
      }
    }, this.interval_cacheInvalidator);
  }
  /**
   * in Store, we have  array of OLHC for each symbol
   * we have latest Price of some symbols in dataLatestPrices
   * This function merges/set the latest price of appropriate symbols in state
   * @param dataLatestPrices
   * @param state
   */
  mergeLatestPriceToStore(dataLatestPrices, state) {
    if (!dataLatestPrices)
      return;
    Object.keys(dataLatestPrices).forEach(function(symbolId, index) {
      if (state[symbolId]) {
        let liveInfoOfSymbol = dataLatestPrices[symbolId];
        let objOnCurrentDate = state[symbolId].pricesOHLCExtended.filter((r) => liveInfoOfSymbol.rts && r.ts == liveInfoOfSymbol.rts.substring(0, 8));
        if (import_lodash.default.isArray(objOnCurrentDate) && objOnCurrentDate.length > 0) {
          objOnCurrentDate = objOnCurrentDate[0];
          objOnCurrentDate.open = liveInfoOfSymbol.r || 0;
          objOnCurrentDate.low = liveInfoOfSymbol.l || 0;
          objOnCurrentDate.high = liveInfoOfSymbol.h || 0;
          objOnCurrentDate.close = +liveInfoOfSymbol.p || 0;
          objOnCurrentDate.v = +liveInfoOfSymbol.v || 0;
        }
      }
    });
  }
  /**
   * Load from cache or from remote
   * save to state when cache miss and we need to get data from remote
   * @param {*} symbolCategory
   * @param {*} symbolId
   * @param {*} tickPeriod
   * @param {*} limitLength
   */
  async loadSymbolHistory(symbolCategory, symbolId, tickPeriod = "1D", limitLength = 660) {
    if (this.state[symbolId] && this.state[symbolId].pricesOHLCExtended) {
      return this.state[symbolId].pricesOHLCExtended;
    }
    let pricesOHLCExtended = await this.listSymbolHistory(...arguments);
    if (pricesOHLCExtended) {
      pricesOHLCExtended = import_lodash.default.orderBy(pricesOHLCExtended, ["ts"], ["asc"]);
      this.state[symbolId] = {
        symbolCategory,
        pricesOHLCExtended
      };
    }
    return pricesOHLCExtended;
  }
};

// src/index.ts
var foo = "foo";
var src_default = { CommonHelper, Util, HtmlHelper, StockvnHelper, AuthHelper, ReactiveSymbolHistoryStore };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  foo
});

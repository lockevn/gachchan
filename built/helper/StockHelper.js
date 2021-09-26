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
var Decimal = require("decimal.js");
var CommonHelper_1 = require("./CommonHelper");
var StockHelper = /** @class */ (function () {
    function StockHelper() {
    }
    /**
     * StockCompany usually represent 1000000 (1 million) as 1,000,000
     * We need to convert it to 1000000
     * @param {*} numberString
     */
    StockHelper.StandardizeVolNumber = function (numberString) {
        if (typeof numberString === "number") {
            return numberString;
        }
        // undefined or null
        if (!numberString) {
            return numberString;
        }
        var ret;
        if (typeof numberString === "string") {
            ret = numberString.replace(/,/g, "");
        }
        // else{
        //   // is number, do nothing
        // }
        return CommonHelper_1.default.ToNumber(ret);
    };
    /**
     * continuous checkWorkingHours and call callbackFn with interval
     * @param {*} callbackFn
     * @param {*} interval
     */
    StockHelper.ContinuousExecuteInWorkingHours = function (callbackFn, interval) {
        var _this = this;
        if (!callbackFn) {
            return;
        }
        var timerId = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.IsInWorkingHours() && this.IsInWorkingDays())) return [3 /*break*/, 2];
                        return [4 /*yield*/, callbackFn()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 2: return [2 /*return*/];
                }
            });
        }); }, interval);
        return timerId;
    };
    /**
     * from "now", if in working day, get hhmm time in hhmm format, like "1130" or "0959", then check
     * @param {Date} now
     * @returns boolean
     */
    StockHelper.IsInWorkingHours = function (now) {
        if (!now) {
            now = new Date();
        }
        if (!StockHelper.IsInWorkingDays(now))
            return false;
        var hhmm = CommonHelper_1.default.GetCurrentHoursMinutesString(now);
        if (("0845" <= hhmm && hhmm <= "1130") || ("1300" <= hhmm && hhmm <= "1445")) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     *  is in ATO sessions
     * @param {String} now hhhmm string, like "1130" or "0959"
     */
    StockHelper.IsIn_ATO_Sessions = function (now) {
        if (!now) {
            now = CommonHelper_1.default.GetCurrentHoursMinutesString();
        }
        if ("0845" <= now && now <= "0915") {
            return true;
        }
        return false;
    };
    /**
     *  is in ATC sessions
     * @param {String} now hhhmm string, like "1130" or "0959"
     */
    StockHelper.IsIn_ATC_Sessions = function (now) {
        if (!now) {
            now = CommonHelper_1.default.GetCurrentHoursMinutesString();
        }
        if ("1430" <= now && now <= "1445") {
            return true;
        }
        return false;
    };
    /**
     * return true if current moment is Monday to Friday
     * @param {Date} now
     */
    StockHelper.IsInWorkingDays = function (now) {
        if (!now) {
            now = new Date();
        }
        var currentDay = now.getDay(); // // Sunday - Saturday : 0 - 6
        if (0 < currentDay && currentDay < 6) {
            return true;
        }
        else {
            return false;
        }
    };
    return StockHelper;
}());
exports.default = StockHelper;

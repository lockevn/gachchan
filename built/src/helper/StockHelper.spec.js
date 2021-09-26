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
var dist_1 = require("../../dist");
var target = dist_1.StockHelper;
describe("StockHelper", function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    it("StandardizeVolNumber", function () {
        expect(target.StandardizeVolNumber("")).toBe("");
        expect(target.StandardizeVolNumber("0")).toBe(0);
        expect(target.StandardizeVolNumber(0)).toBe(0);
        expect(target.StandardizeVolNumber("1000")).toBe(1000);
        expect(target.StandardizeVolNumber("1,000")).toBe(1000);
        expect(target.StandardizeVolNumber("1,000,000.11")).toBe(1000000.11);
        expect(target.StandardizeVolNumber(1000)).toBe(1000);
        expect(target.StandardizeVolNumber(1000.11)).toBe(1000.11);
    });
    describe("Mocking times", function () {
        it("IsInWorkingHours in non working day first Sunday of Aug 2021", function () {
            expect(target.IsInWorkingHours(new Date("2021-08-01 10:10:10"))).toBe(false); // first sunday of August
        });
        it("IsInWorkingHours in working day first Monday of Aug 2021", function () {
            expect(target.IsInWorkingHours(new Date("2021-08-02 10:10:10"))).toBe(true); // monday
            expect(target.IsInWorkingHours(new Date("2021-08-02 08:45"))).toBe(true);
            expect(target.IsInWorkingHours(new Date("2021-08-02 09:14"))).toBe(true);
            expect(target.IsInWorkingHours(new Date("2021-08-02 11:30"))).toBe(true);
            expect(target.IsInWorkingHours(new Date("2021-08-02 11:31"))).toBe(false);
            expect(target.IsInWorkingHours(new Date("2021-08-02 12:59"))).toBe(false);
            expect(target.IsInWorkingHours(new Date("2021-08-02 13:00"))).toBe(true);
            expect(target.IsInWorkingHours(new Date("2021-08-02 14:45"))).toBe(true);
            expect(target.IsInWorkingHours(new Date("2021-08-02 14:46"))).toBe(false);
        });
        it("IsIn_ATO_Sessions", function () {
            expect(target.IsIn_ATO_Sessions("0900")).toBe(true);
            expect(target.IsIn_ATO_Sessions("0914")).toBe(true);
            expect(target.IsIn_ATO_Sessions("1100")).toBe(false);
        });
        it("IsIn_ATC_Sessions", function () {
            expect(target.IsIn_ATC_Sessions("1430")).toBe(true);
            expect(target.IsIn_ATC_Sessions("1445")).toBe(true);
            expect(target.IsIn_ATC_Sessions("1446")).toBe(false);
        });
        it("IsInWorkingDays", function () {
            expect(target.IsInWorkingDays(new Date("2021-07-31"))).toBe(false); // last sat of July
            expect(target.IsInWorkingDays(new Date("2021-08-01"))).toBe(false); // first sunday of August
            expect(target.IsInWorkingDays(new Date("2021-08-02"))).toBe(true); // monday
        });
    });
    // describe("generateRandomPriceData", function() {
    //   it("generateRandomPriceData", function() {
    //     // mock data, with max variation = 7%
    //     function generateRandomPriceData(_startingPrice, _limitLength) {
    //       var arrFakeData = [_startingPrice];
    //       for (var i = 1; i < _limitLength; i++) {
    //         var cur = arrFakeData[i - 1];
    //         var r =
    //           cur *
    //           (1 + ((Math.random() > 0.5 ? -1 : 1) * Math.random()) / 14.28);
    //         arrFakeData.push(xctarget.roundToTwo(r));
    //       }
    //       return arrFakeData;
    //     }
    //     var arr = generateRandomPriceData(100, 10);
    //     assert.equal(arr.length, 10);
    //     assert.equal(arr[0], 100);
    //   });
    // });
});

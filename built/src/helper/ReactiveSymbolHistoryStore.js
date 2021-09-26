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
// TODO: clone this class from lib-share to use here, because currently, we don;t know why we cannot import it from lib-share and make it run here
var _ = require("lodash");
/**
 * get datasnapshot, then provide to the actors chain
 * TODO: PERF: cache the history,
 * next time, only query the latest price of all symbols, then modify the last point of priceOHLCExtended in memory
 * periodically refresh the cache (hourly is OK)
 */
var ReactiveSymbolHistoryStore = /** @class */ (function () {
    function ReactiveSymbolHistoryStore() {
        // super();
        /**
         * caching state
         */
        this.state = {
        // AAA : {
        //   symbolCategory: "VietnamStock",
        //   pricesOHLCExtended:
        // [{open, high, low, close, ts, v }]
        // }
        };
        /**
         * ref to the firebase path of realtime price
         */
        this.fb$vietnamStock = null;
        /**
         * Interval to run the cacheInvalidator() check. Default ls 30 000 (30s)
         */
        this.interval_cacheInvalidator = 30000;
        /**
         * Interval to sync all latest price to the whole Store. Default ls 60 000 (60s)
         */
        this.interval_syncAllLatestPricesAtOnce = 60000;
    }
    /**
     * run every 30 seconds, to clear the state cache. It's up to the handler to decide clear what and when.
     * By default, it does nothing.
     * @param {*} ReactiveStore the current Store instance
     */
    ReactiveSymbolHistoryStore.prototype.cacheInvalidator = function (ReactiveStore) { };
    /**
     * VIRTUAL: How to get the ref to the vietnamStock on Firebase
     */
    ReactiveSymbolHistoryStore.prototype.get_fb$VietnamStock = function () { };
    /**
     * VIRTUAL:
     */
    ReactiveSymbolHistoryStore.prototype.getLatestPrices_HTTP_Once = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    /**
     * VIRTUAL: load OLHC from remote service
     * @param {*} symbolCategory
     * @param {*} symbolId
     * @param {*} tickPeriod
     * @param {*} limitLength
     */
    ReactiveSymbolHistoryStore.prototype.listSymbolHistory = function (symbolCategory, symbolId, tickPeriod, limitLength) {
        if (tickPeriod === void 0) { tickPeriod = "1D"; }
        if (limitLength === void 0) { limitLength = 660; }
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    /**
     * Init this Store, setup func, call func from Virtual methods, start all the interval
     */
    ReactiveSymbolHistoryStore.prototype.init = function () {
        // start hooking on live change
        var _this = this;
        this.fb$vietnamStock = this.get_fb$VietnamStock();
        // hook on latest price on Firebase, modify the latest datapoint in Store
        if (_.isEmpty(this.fb$vietnamStock) == false && this.fb$vietnamStock.on) {
            // Hook on live change
            this.fb$vietnamStock.on("child_changed", function (snapshot) {
                var _a;
                // snapshot is the changed symbol only, E.g.: "GMD"
                _this.mergeLatestPriceToStore((_a = {},
                    _a[snapshot.key] = snapshot.val(),
                    _a), _this.state);
            });
        }
        // periodically sync the whole list of symbols, by HTTP request, in case the realtime Stream above is disconnected
        setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var dataLatestPrices_AllSymbols;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLatestPrices_HTTP_Once()];
                    case 1:
                        dataLatestPrices_AllSymbols = _a.sent();
                        this.mergeLatestPriceToStore(dataLatestPrices_AllSymbols, this.state);
                        return [2 /*return*/];
                }
            });
        }); }, this.interval_syncAllLatestPricesAtOnce);
        // periodically check to know whether we should clear the cache
        setInterval(function () {
            if (_this.cacheInvalidator) {
                _this.cacheInvalidator();
            }
        }, this.interval_cacheInvalidator);
        ///////////////
    };
    /**
     * in Store, we have  array of OLHC for each symbol
     * we have latest Price of some symbols in dataLatestPrices
     * This function merges/set the latest price of appropriate symbols in state
     * @param dataLatestPrices
     * @param state
     */
    ReactiveSymbolHistoryStore.prototype.mergeLatestPriceToStore = function (dataLatestPrices, state) {
        if (!dataLatestPrices)
            return;
        Object.keys(dataLatestPrices).forEach(function (symbolId, index) {
            if (state[symbolId]) {
                // if we have the history array of OLHC
                // update the latest C in state
                // NOTE: about the problem; when day change (to next day, because bee run nonstop from day1 to day2), we have to avoid assigning the current price (of day2) to close price of day1
                var liveInfoOfSymbol_1 = dataLatestPrices[symbolId];
                // liveInfoOfSymbol structure
                //         BMP:Object {ce: 56.3, fl: 49.05, frc_HOSE_ats: "20190311 133008", …}
                // ce:56.3
                // fl:49.05
                // frc_ats:"20190311 003610"
                // frc_crawler_ats:"20190311 133008"
                // frc_HOSE_ats:"20190311 133008"
                // frc_rts:20190308
                // h:53.5
                // l:52.6
                // p:"53"
                // r:52.7
                // rts:"20190311 134212"
                // ts:1552286575126
                // v:"1000"
                var objOnCurrentDate = state[symbolId].pricesOHLCExtended.filter(function (r) { return liveInfoOfSymbol_1.rts && r.ts == liveInfoOfSymbol_1.rts.substring(0, 8); });
                if (_.isArray(objOnCurrentDate) && objOnCurrentDate.length > 0) {
                    objOnCurrentDate = objOnCurrentDate[0];
                    // objOnCurrentDate is referenced by ref, so we can update it here
                    objOnCurrentDate.open = liveInfoOfSymbol_1.r || 0; // update info of currentDate to the cache
                    objOnCurrentDate.low = liveInfoOfSymbol_1.l || 0; // update info of currentDate to the cache
                    objOnCurrentDate.high = liveInfoOfSymbol_1.h || 0; // update info of currentDate to the cache
                    objOnCurrentDate.close = +liveInfoOfSymbol_1.p || 0; // update info of currentDate to the cache
                    objOnCurrentDate.v = +liveInfoOfSymbol_1.v || 0; // update info of currentDate to the cache
                }
            }
        });
    };
    /**
     * Load from cache or from remote
     * save to state when cache miss and we need to get data from remote
     * @param {*} symbolCategory
     * @param {*} symbolId
     * @param {*} tickPeriod
     * @param {*} limitLength
     */
    ReactiveSymbolHistoryStore.prototype.loadSymbolHistory = function (symbolCategory, symbolId, tickPeriod, limitLength) {
        if (tickPeriod === void 0) { tickPeriod = "1D"; }
        if (limitLength === void 0) { limitLength = 660; }
        return __awaiter(this, arguments, void 0, function () {
            var pricesOHLCExtended;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // cache hit
                        if (this.state[symbolId] && this.state[symbolId].pricesOHLCExtended) {
                            // console.log("cache hit", symbolId);
                            return [2 /*return*/, this.state[symbolId].pricesOHLCExtended];
                        }
                        return [4 /*yield*/, this.listSymbolHistory.apply(this, arguments)];
                    case 1:
                        pricesOHLCExtended = _a.sent();
                        if (pricesOHLCExtended) {
                            pricesOHLCExtended = _.orderBy(pricesOHLCExtended, ["ts"], ["asc"]);
                            // logdebug(`Cached ${symbolId} to state`);
                            this.state[symbolId] = {
                                symbolCategory: symbolCategory,
                                pricesOHLCExtended: pricesOHLCExtended,
                            };
                        }
                        return [2 /*return*/, pricesOHLCExtended];
                }
            });
        });
    };
    return ReactiveSymbolHistoryStore;
}());
exports.default = ReactiveSymbolHistoryStore;

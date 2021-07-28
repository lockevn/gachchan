"use strict"

// TODO: clone this class from lib-share to use here, because currently, we don;t know why we cannot import it from lib-share and make it run here

const _ = require("lodash")

/**
   * // get datasnapshot, then provide to the actors chain
      // TODO: PERF: cache the history,
      // next time, only query the latest price of all symbols, then modify the last point of priceOHLCExtended in memory
      // periodically refresh the cache (hourly is OK)
   */
class ReactiveSymbolHistoryStore {
  /**
   * run every 30 seconds, to clear the state cache. It's up to the handler to decide clear what and when.
   * By default, it does nothing.
   * @param {*} ReactiveStore the current Store instance
   */
  cacheInvalidator(ReactiveStore) {}

  /**
   * VIRTUAL: How to get the ref to the vietnamStock on Firebase
   */
  get_fb$VietnamStock() {}

  /**
   * VIRTUAL:
   */
  async getLatestPrices_HTTP_Once() {}

  /**
   * VIRTUAL: load OLHC from remote service
   * @param {*} symbolCategory
   * @param {*} symbolId
   * @param {*} tickPeriod
   * @param {*} limitLength
   */
  async listSymbolHistory(symbolCategory, symbolId, tickPeriod = "1D", limitLength = 660) {}

  constructor() {
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
   * Init this Store, setup func, call func from Virtual methods, start all the interval
   */
  init() {
    // start hooking on live change

    this.fb$vietnamStock = this.get_fb$VietnamStock()

    // hook on latest price on Firebase, modify the latest datapoint in Store
    if (_.isEmpty(this.fb$vietnamStock) == false && this.fb$vietnamStock.on) {
      // Hook on live change
      this.fb$vietnamStock.on("child_changed", snapshot => {
        // snapshot is the changed symbol only, E.g.: "GMD"
        this.mergeLatestPriceToStore(
          {
            [snapshot.key]: snapshot.val()
          },
          this.state
        )
      })
    }

    // periodically sync the whole list of symbols, by HTTP request, in case the realtime Stream above is disconnected
    setInterval(async () => {
      // logdebug("sync all");
      const dataLatestPrices_AllSymbols = await this.getLatestPrices_HTTP_Once()
      this.mergeLatestPriceToStore(dataLatestPrices_AllSymbols, this.state)
    }, this.interval_syncAllLatestPricesAtOnce)

    // periodically check to know whether we should clear the cache
    setInterval(() => {
      if (this.cacheInvalidator) {
        this.cacheInvalidator()
      }
    }, this.interval_cacheInvalidator)
    ///////////////
  }

  /**
   * in Store, we have  array of OLHC for each symbol
   * we have latest Price of some symbols in dataLatestPrices
   * This function merges/set the latest price of appropriate symbols in state
   * @param dataLatestPrices
   * @param state
   */
  mergeLatestPriceToStore(dataLatestPrices, state) {
    if (!dataLatestPrices) return

    Object.keys(dataLatestPrices).forEach(function(symbolId, index) {
      if (state[symbolId]) {
        // if we have the history array of OLHC
        // update the latest C in state
        // NOTE: about the problem; when day change (to next day, because bee run nonstop from day1 to day2), we have to avoid assigning the current price (of day2) to close price of day1

        let liveInfoOfSymbol = dataLatestPrices[symbolId]
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

        let objOnCurrentDate = state[symbolId].pricesOHLCExtended.filter(r => liveInfoOfSymbol.rts && r.ts == liveInfoOfSymbol.rts.substring(0, 8))
        if (_.isArray(objOnCurrentDate) && objOnCurrentDate.length > 0) {
          objOnCurrentDate = objOnCurrentDate[0]

          // objOnCurrentDate is referenced by ref, so we can update it here
          objOnCurrentDate.open = liveInfoOfSymbol.r || 0 // update info of currentDate to the cache
          objOnCurrentDate.low = liveInfoOfSymbol.l || 0 // update info of currentDate to the cache
          objOnCurrentDate.high = liveInfoOfSymbol.h || 0 // update info of currentDate to the cache
          objOnCurrentDate.close = +liveInfoOfSymbol.p || 0 // update info of currentDate to the cache
          objOnCurrentDate.v = +liveInfoOfSymbol.v || 0 // update info of currentDate to the cache
        }
      }
    })
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
    // cache hit
    if (this.state[symbolId] && this.state[symbolId].pricesOHLCExtended) {
      // console.log("cache hit", symbolId);
      return this.state[symbolId].pricesOHLCExtended
    }

    // cache miss, we fetch the fresh data from API
    let pricesOHLCExtended = await this.listSymbolHistory(...arguments)
    if (pricesOHLCExtended) {
      pricesOHLCExtended = _.orderBy(pricesOHLCExtended, ["ts"], ["asc"])

      // logdebug(`Cached ${symbolId} to state`);
      this.state[symbolId] = {
        symbolCategory,
        pricesOHLCExtended
      }
    }

    return pricesOHLCExtended
  }
}

// in order to make this lib live in both node and browser,
// we export to NodeJs if we have the module
// otherwise, we assign to the global window object of Browser
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  /**
   * Node Module exports.
   * @public
   */
  module.exports = ReactiveSymbolHistoryStore
} else {
  window.xcReactiveSymbolHistoryStore = ReactiveSymbolHistoryStore
}
/************** ===================================== */

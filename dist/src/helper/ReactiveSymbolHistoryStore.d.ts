/**
 * get datasnapshot, then provide to the actors chain
 * TODO: PERF: cache the history,
 * next time, only query the latest price of all symbols, then modify the last point of priceOHLCExtended in memory
 * periodically refresh the cache (hourly is OK)
 */
export default class ReactiveSymbolHistoryStore {
    /**
     * run every 30 seconds, to clear the state cache. It's up to the handler to decide clear what and when.
     * By default, it does nothing.
     * @param {*} ReactiveStore the current Store instance
     */
    cacheInvalidator(ReactiveStore: any): void;
    /**
     * VIRTUAL: How to get the ref to the vietnamStock on Firebase
     */
    get_fb$VietnamStock(): void;
    /**
     * VIRTUAL:
     */
    getLatestPrices_HTTP_Once(): Promise<void>;
    /**
     * VIRTUAL: load OLHC from remote service
     * @param {*} symbolCategory
     * @param {*} symbolId
     * @param {*} tickPeriod
     * @param {*} limitLength
     */
    listSymbolHistory(symbolCategory: any, symbolId: any, tickPeriod?: any, limitLength?: any): Promise<void>;
    /**
     * caching state
     */
    state: {};
    /**
     * ref to the firebase path of realtime price
     */
    fb$vietnamStock: void;
    /**
     * Interval to run the cacheInvalidator() check. Default ls 30 000 (30s)
     */
    interval_cacheInvalidator: number;
    /**
     * Interval to sync all latest price to the whole Store. Default ls 60 000 (60s)
     */
    interval_syncAllLatestPricesAtOnce: number;
    /**
     * Init this Store, setup func, call func from Virtual methods, start all the interval
     */
    init(): void;
    /**
     * in Store, we have  array of OLHC for each symbol
     * we have latest Price of some symbols in dataLatestPrices
     * This function merges/set the latest price of appropriate symbols in state
     * @param dataLatestPrices
     * @param state
     */
    mergeLatestPriceToStore(dataLatestPrices: any, state: any): void;
    /**
     * Load from cache or from remote
     * save to state when cache miss and we need to get data from remote
     * @param {*} symbolCategory
     * @param {*} symbolId
     * @param {*} tickPeriod
     * @param {*} limitLength
     */
    loadSymbolHistory(symbolCategory: any, symbolId: any, tickPeriod?: any, limitLength?: any, ...args: any[]): Promise<any>;
}
//# sourceMappingURL=ReactiveSymbolHistoryStore.d.ts.map
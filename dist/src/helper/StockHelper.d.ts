export default class StockHelper {
    /**
     * StockCompany usually represent 1000000 (1 million) as 1,000,000
     * We need to convert it to 1000000
     * @param {*} numberString
     */
    static StandardizeVolNumber(numberString: any): any;
    /**
     * continuous checkWorkingHours and call callbackFn with interval
     * @param {*} callbackFn
     * @param {*} interval
     */
    static ContinuousExecuteInWorkingHours(callbackFn: any, interval: any): NodeJS.Timer;
    /**
     * from "now", if in working day, get hhmm time in hhmm format, like "1130" or "0959", then check
     * @param {Date} now
     * @returns boolean
     */
    static IsInWorkingHours(now: Date): boolean;
    /**
     *  is in ATO sessions
     * @param {String} now hhhmm string, like "1130" or "0959"
     */
    static IsIn_ATO_Sessions(now: string): boolean;
    /**
     *  is in ATC sessions
     * @param {String} now hhhmm string, like "1130" or "0959"
     */
    static IsIn_ATC_Sessions(now: string): boolean;
    /**
     * return true if current moment is Monday to Friday
     * @param {Date} now
     */
    static IsInWorkingDays(now: Date): boolean;
}
//# sourceMappingURL=StockHelper.d.ts.map
export default class CommonHelper {
    /**
     * @deprecated use ToNumber() TODO: remove this
     */
    static ToActualNumber(val: any): any;
    /**
     * @deprecated use ToNumber() TODO: remove this
     */
    static FormatNumber(numberString: any, fractationDigits?: number): any;
    /**
     * if provide a number or number-string, this will return a number, with fractationDigits
     * if provided a string ("AT, ATC, ATO") throw exception
     * NonNumberValue like null, undefined and NaN is treat as 0
     * @param {string} numberString
     * @param {number} fractationDigits number of decimal digit
     * @param {*} treatNonNumberValueAs
     * @returns number
     */
    static ToNumber(numberString: string, fractationDigits: number, treatNonNumberValueAs?: any): any;
    /**
     * round value to X decimal places https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
     * 19.103857566765578635.toBe(19.1)
     * 19.143857566765578635.toBe(19.1)
     * 19.144857566765578635.toBe(19.1)
     * @param {*} value
     * @returns
     */
    static RoundNumber(value: any, decimalPlaces?: number): number;
    /**
     * Continuously call actionFn by setTimeout with interval. The next process will be schedule after current process completed (success or failed)
     * Interval can be determined (randomly) by intervalFn() and delay betwen execution can be vary.
     * @param {Function} actionFn support async function
     * @param {Number} DEFAULT_INTERVAL if nothing provided or callbackFn success, this is the interval for running. If adjustment happen, it will not exceed 2*DEFAULT_INTERVAL
     * @param {Function} intervalFn intervalFn(currentDelay, isPreviousRunSuccess, DEFAULT_INTERVAL). if currentDelay is undefined, should return the default. if currentDelay has value, should return next delay.
     * @param {Boolean} executeImmediately if true, invoke actionFn() immediately when calling this function
     * @param {Function} shouldPerformActionFn intervalFn(currentDelay, isPreviousRunSuccess, DEFAULT_INTERVAL). return true if you want to perform actionFn when timeout happen.
     */
    static ContinuousExecuteBySetTimeout(actionFn: Function, DEFAULT_INTERVAL?: number, intervalFn?: Function, executeImmediately?: boolean, shouldPerformActionFn?: Function): Promise<{}>;
    /**
     * create a default function/behaviour, calculate delay based on previous delay and isPreviousRunSuccess.
     * When calling ContinuousExecuteBySetTimeout() without intervalFn, this func will be used as default implementation
     * @param {*} previousDelay
     * @param {*} isPreviousRunSuccess
     * @returns
     */
    static ContinuousExecuteBySetTimeoutDefaultIntervalFn(previousDelay: any, isPreviousRunSuccess: any, DEFAULT_INTERVAL: any): any;
    /**
     * change 1 to 1️⃣ (unicode square box character)
     * @param {*} numberString
     * @returns {string}
     */
    static RepresentNumberInIconicDigit(numberString: any): string;
    /**
     * if now is 14:22, this return 1422.
     * 9:40AM ==> 0940
     * 16:03 (PM) ==> 1603
     * @param {Date} date
     * @returns {string}
     */
    static GetCurrentHoursMinutesString(date: Date): string;
    /**
     * if now is 14:22:59, this return 142259.
     * 9:40AM ==> 094000
     * 16:03 (PM) ==> 160300
     */
    static GetCurrentHoursMinutesSecondsString(date: any): string;
    /**
     * return current date time in full format, in specific culture (language) and timezone
     * @param {*} culture
     * @param {*} timezone
     * @returns
     */
    static GetDatetimeNowString(culture?: any, timezone?: any): string;
    /**
     * random an int number, maximum is max - 1. Max = 10, so return 0 to 10
     * @param {*} max
     * @returns number integer
     */
    static GetRandomIntegerTo(max: any): number;
    /**
     * return random element inside array
     * @param {*} arr
     * @returns
     */
    static GetRandomArrayElement(arr: any): any;
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
    static HasAnyOfIntersection(firstList: number | string | number[] | string[], otherList?: number | string | number[] | string[], ignoreCase?: boolean): boolean;
    /**
     * return percent of portion to full, 25 50 ==> 50
     * @param {*} portion
     * @param {*} full
     * @param {*} fractationDigits
     * @returns number
     */
    static Percent(portion: any, full: any, fractationDigits: any): number;
    /**
     * from 100 to 110, the diff is 10, and is 10%. Return 10
     * @param {*} from
     * @param {*} to
     * @returns null if from to is not number
     */
    static DiffInPercent(from: any, to: any, fractationDigits: any): number;
    /**
     * join all arguments with "/" seperator.
     * E.g.: JoinPaths("a", b, c)
     * @returns String
     */
    static JoinPaths(...args: any[]): any;
    /**
     * empty string, null, NaN, undefined return ""
     *  or text string which is not a number, return ""
     * format number to string (usage of PercentValueFormatter can use this)
     * @param {*} val
     * @param {*} fractationDigits
     * @param {*} showPrefixSign
     * @returns string
     */
    static ToNumberString(val: any, fractationDigits?: any, showPrefixSign?: any, showZeroVal?: boolean, suffix?: string): string;
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
    static NumberToUnitString(numberString: number | string, unitDividen?: number, fractationDigits?: number, unit?: string, locale?: string): string;
}
//# sourceMappingURL=CommonHelper.d.ts.map
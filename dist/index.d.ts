declare class DateTimeHelper {
    /**
     * if now is 2002 12 31 14:22, this return 20021231.
     * @param {Date} date
     * @returns {string}
     */
    static GetCurrentYearMonthDayString(date: Date): string;
    /**
     * if now is 14:22, this return 1422.
     * 9:40AM ==> 0940
     * 16:03 (PM) ==> 1603
     * @param {Date} date
     * @returns {string}
     */
    static GetCurrentHoursMinutesString(date?: Date): string;
    /**
     * if now is 14:22:59, this return 142259.
     * 9:40AM ==> 094000
     * 16:03 (PM) ==> 160300
     */
    static GetCurrentHoursMinutesSecondsString(date?: Date): string;
    /**
     *
     * @returns string the Date string in format yyyyMMdd (in UTC timezone)
     */
    static GetCurrentYearMonthDayStringUTC(date: Date): string;
    /**
     *
     * @returns string the Time string in format HHmm (in UTC timezone)
     */
    static GetCurrentHoursMinutesStringUTC(date: Date): string;
    /**
     *
     * @returns string the Time string in format HHmmss (in UTC timezone)
     */
    static GetCurrentHoursMinutesSecondsStringUTC(date?: Date): string;
    /**
     * return current date time in full format, in specific culture (language) and timezone
     * @param {*} culture
     * @param {*} timezone
     * @returns
     */
    static GetDatetimeNowString(culture?: string, timezone?: string): string;
    /** return the DateTime object like it was get with `new Date()` in a host computer in expected timezone */
    static GetTimeInGMTTimezone(gmtHour?: number): Date;
}

declare class CommonHelper {
    /**
     * if provide a number or number-string, this will return a number, with fractationDigits
     * if provided a string ("AT, ATC, ATO") throw exception
     * NonNumberValue like null, undefined and NaN is treat as 0
     * @param {string} numberString
     * @param {number} fractationDigits number of decimal digit
     * @returns number
     */
    static ToNumber(numberString: number | string, fractationDigits?: number, treatNonNumberValueAs?: number): number;
    /**
     * round value to X decimal places https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
     * 19.103857566765578635.toBe(19.1)
     * 19.143857566765578635.toBe(19.1)
     * 19.144857566765578635.toBe(19.1)
     * @param {*} value
     * @returns
     */
    static RoundNumber(value: number, decimalPlaces?: number): number;
    /**
     * Continuously call actionFn by setTimeout with interval. The next process will be schedule after current process completed (success or failed)
     * Interval can be determined (randomly) by intervalFn() and delay between execution can be vary.
     * @param {Function} actionFn support async function
     * @param {Number} DEFAULT_INTERVAL if nothing provided or callbackFn success, this is the interval for running. If adjustment happen, it will not exceed 2*DEFAULT_INTERVAL
     * @param {Function} intervalFn intervalFn(currentDelay, isPreviousRunSuccess, DEFAULT_INTERVAL). if currentDelay is undefined, should return the default. if currentDelay has value, should return next delay.
     * @param {Boolean} executeImmediately if true, invoke actionFn() immediately (in the beginning) when calling this function
     * @param {Function} shouldPerformActionFn shouldPerformActionFn(currentDelay, isPreviousRunSuccess, DEFAULT_INTERVAL). this function should return true if you want to perform actionFn when timeout happen.
     */
    static ContinuousExecuteBySetTimeout(actionFn: Function, DEFAULT_INTERVAL?: number, intervalFn?: Function, executeImmediately?: boolean, shouldPerformActionFn?: (_0: number, _1?: boolean, _2?: number) => boolean): Promise<{
        timerId: any;
        delay: number;
    }>;
    /**
     * create a default function/behaviour, calculate delay based on previous delay and isPreviousRunSuccess.
     * When calling ContinuousExecuteBySetTimeout() without intervalFn, this func will be used as default implementation
     * @param {*} previousDelay
     * @param {*} isPreviousRunSuccess
     * @returns
     */
    static ContinuousExecuteBySetTimeoutDefaultIntervalFn(previousDelay: number, isPreviousRunSuccess: boolean, DEFAULT_INTERVAL: number): number;
    /**
     * change 1 to 1️⃣ (unicode square box character)
     * @param {*} numberString
     * @returns {string}
     */
    static RepresentNumberInIconicDigit(numberString: string | null): string;
    /**
     * random an int number, maximum is max - 1. Max = 10, so return 0 to 10
     * @param {*} max
     * @returns number integer
     */
    static GetRandomIntegerTo(max: number): number;
    /**
     * return random element inside array
     * @param {*} arr
     * @returns
     */
    static GetRandomArrayElement(arr: any[]): any;
    /**
     * This will modify the input array https://stackoverflow.com/a/2450976
     * @param {*} array
     * @returns
     */
    static ShuffleArray(array: any[]): any[];
    /**
     * check for intersection of number or string
     * E.g.: [1,2,3], 2 ==> true
     * E.g.: ["a","b","c"], ["a"] ==> true
     * E.g.: ["a","b","c"], ["A"], true ==> true, a==A because of ignoreCase
     *
     * value (which is not string) is compared by === (null === null, undefined === undefined)
     * @param firstList
     * @param otherList accept single value or array
     * @param ignoreCase if any value is string, cast either values of firstList and otherList toString(), then compare ignore case
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
    static Percent(portion: number, full: number, fractationDigits: number): number;
    /**
     * from 100 to 110, the diff is 10, and is 10%. Return 10
     * @param {*} from
     * @param {*} to
     * @returns null if from to is not number
     */
    static DiffInPercent(from: number, to: number, fractationDigits: number): number | null;
    /**
     * join all arguments with "/" seperator.
     * E.g.: JoinPaths("a", b, c)
     * @returns String
     */
    static JoinPaths(): string;
    /**
     * empty string, null, NaN, undefined return ""
     *  or text string which is not a number, return ""
     * format number to string (usage of PercentValueFormatter can use this)
     * @param val
     * @param fractationDigits
     * @param showPrefixSign
     * @param showZeroVal
     * @param suffix
     * @returns
     */
    static ToNumberString(val?: number | string, fractationDigits?: number, showPrefixSign?: boolean, showZeroVal?: boolean, suffix?: string): string;
    /**
     * display 1000000 as 1tr, 1000 as 1k
     * display 1000000 as 1,000,000 (when using en-US locale)
     * Also round the number after converting (100400 ==> 100k, 100500 ==> 101k)
     * vi-VN default thounsand separator is ,
     * 0 will be returned as "0"
     * NaN or "" will be returned as ""
     * "ATC" (which is cannot be converted to number) will be returned as is "ATC"
     * @param {number | string} numberString original number (string) to format. This string must be able to convert to number.
     * @param {number} unitDividen dividen divide number to this
     * @param {number} fractationDigits default is 0 (1000 --> 1,000). if 1, 1000,1 --> 1,000.1
     * @param {string} unit default is "tr" (triệu đồng VN)
     * @param {string} locale "en-US" "vi-VN"
     */
    static NumberToUnitString(numberString: number | string, unitDividen?: number, fractationDigits?: number, unit?: string, locale?: string): string;
    /**
     * @deprecated since version 6.1.0
     * if now is 2002 12 31 14:22, this return 20021231.
     * @param {Date} date
     * @returns {string}
     */
    static GetCurrentYearMonthDayString: typeof DateTimeHelper.GetCurrentYearMonthDayString;
    /**
     * @deprecated since version 6.1.0
     * if now is 14:22, this return 1422.
     * 9:40AM ==> 0940
     * 16:03 (PM) ==> 1603
     * @param {Date} date
     * @returns {string}
     */
    static GetCurrentHoursMinutesString: typeof DateTimeHelper.GetCurrentHoursMinutesString;
    /**
     * @deprecated since version 6.1.0
     * if now is 14:22:59, this return 142259.
     * 9:40AM ==> 094000
     * 16:03 (PM) ==> 160300
     */
    static GetCurrentHoursMinutesSecondsString: typeof DateTimeHelper.GetCurrentHoursMinutesSecondsString;
    /**
     * @deprecated since version 6.1.0
     * @returns string the Date string in format yyyyMMdd (in UTC timezone)
     */
    static GetCurrentYearMonthDayStringUTC: typeof DateTimeHelper.GetCurrentYearMonthDayStringUTC;
    /**
     * @deprecated since version 6.1.0
     * @returns string the Time string in format HHmm (in UTC timezone)
     */
    static GetCurrentHoursMinutesStringUTC: typeof DateTimeHelper.GetCurrentHoursMinutesStringUTC;
    /**
     * @deprecated since version 6.1.0
     * @returns string the Time string in format HHmmss (in UTC timezone)
     */
    static GetCurrentHoursMinutesSecondsStringUTC: typeof DateTimeHelper.GetCurrentHoursMinutesSecondsStringUTC;
    /**
     * @deprecated since version 6.1.0
     * return current date time in full format, in specific culture (language) and timezone
     * @param {*} culture
     * @param {*} timezone
     * @returns
     */
    static GetDatetimeNowString: typeof DateTimeHelper.GetDatetimeNowString;
}

declare class StockvnHelper {
    /**
     * StockCompany usually represent 1000000 (1 million) as 1,000,000
     * We need to convert it to 1000000
     * @param num
     */
    static StandardizeVolNumber(num: string | number): number;
    /**
     * continuous checkWorkingHours and call callbackFn with interval
     * @param {*} callbackFn
     * @param {*} interval
     */
    static ContinuousExecuteInWorkingHours(callbackFn: Function, interval: number): NodeJS.Timeout | undefined;
    /** return current `hhmm` timestring in GMT7 timezone */
    static getCurrentGMT7TimeString(): string;
    /**
     * from "now", if in working day, get hhmm time in hhmm format, like "1130" or "0959", then check
     * @param {Date} now
     * @returns boolean
     */
    static IsInWorkingHours(): boolean;
    /**
     *  is in ATO sessions
     * @param {String} nowString hhhmm string, like "1130" or "0959"
     */
    static IsIn_ATO_Sessions(nowString?: string): boolean;
    /**
     *  is in ATC sessions
     * @param {String} nowString hhhmm string, like "1130" or "0959"
     */
    static IsIn_ATC_Sessions(nowString?: string): boolean;
    /**
     * return true if current moment is Monday to Friday (Vietnam working days) in GMT+7 timezone
     */
    static IsInWorkingDays(): boolean;
}

/**
 * Util class, no state, to provide Util method to work with Roles, User, token
 * This can be used in web, api (nodejs), so make it totally decouple, follow SOLID principle
 */
declare class AuthHelper {
    constructor();
    static get ADMINROLE(): string;
    /**
     * merge 2 arrays of roles and reduce to distinct
     * [1,2,3] & [2, 3, 4] ==> return [1,2,3,4]
     */
    static mergeRoles(arr1: any[], arr2: any[]): any[];
    /**
     * return array of accepted roles. Admin (this.ADMINROLE) will have all roles accepted.
     * Examples: given "crm,advisor", if user has "crm", this returns [crm] only
     * given "crm,advisor", if user has "admin", this returns [crm,advisor]
     *
     * @param requireRoles required roles, to say user is qualified
     * @param userRoles roles of user, to validate with requireRoles
     * @returns array of satisfy roles
     */
    static hasRoles(requireRoles: string, userRoles: string[]): string[];
}

/**
 * Old util class from 2017, will be merged to CommonHelper
 */
declare class Util {
    static GetRandomNumberBetween(min: number, max: number): number;
    /**
     * split string into array, remove empty entries, each output string is trimmed
     * "1,2,3 ,,, 4, 5 ,6" ==> [1,2,3,4,5,6]
     * @param strCommaSeparated
     */
    static splitByCommaAndTrim(strCommaSeparated?: string): string[];
    /**
     * merge 2 arrays of entries and reduce to distinct
     * [1,2,3] & [2, 3, 4] ==> return [1,2,3,4]
     * @param {Array} arr1
     * @param {Array} arr2
     */
    static mergeAndDistinct(arr1: any[], arr2: any[]): any[];
    /**
     * give you the Date object, from the jsonDateString (return from some API services)
     * @param jsonDateString string of this format "/Date(2342353453434)/"
     */
    static parseJsonDate(jsonDateString: string): Date;
    /**
     * Joins path segments.  Preserves initial "/" and resolves ".." and "."
     * Does not support using ".." to go above/outside the root.
     * This means that join("foo", "../../bar") will not resolve to "../bar"
     */
    static joinPath(...paths: string[]): string;
    /**
     * A simple function to get the dirname of a path
     * Trailing slashes are ignored. Leading slash is preserved.
     * @param path
     */
    static dirname(path: string): string;
}

declare class HtmlHelper {
    /**
     *
     * @param {string} bodyHtml
     * @param {string[]} tags [style, script, svg]
     * @returns
     */
    static cleanupHtmlTags(bodyHtml: string, tags: string[]): string;
}

declare const foo = "foo";

export { AuthHelper, CommonHelper, HtmlHelper, StockvnHelper, Util, foo };

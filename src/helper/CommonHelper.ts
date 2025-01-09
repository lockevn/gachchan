import _flatten from 'lodash/flatten'
import _isNumber from 'lodash/isNumber'
import _intersectionWith from 'lodash/intersectionWith'
import _intersection from 'lodash/intersection'

import Decimal from 'decimal.js'
import { DateTimeHelper } from './DateTimeHelper'

export class CommonHelper {
  /**
   * if provide a number or number-string, this will return a number, with fractationDigits
   * if provided a string ("AT, ATC, ATO") throw exception
   * NonNumberValue like null, undefined and NaN is treat as 0
   * @param {string} numberString
   * @param {number} fractationDigits number of decimal digit
   * @returns number
   */
  static ToNumber(numberString: number | string, fractationDigits: number = 2, treatNonNumberValueAs = 0) {
    let ret = treatNonNumberValueAs

    const convertedToNumberVal = +numberString
    // note that isNumber(NaN) == true
    if (_isNumber(convertedToNumberVal) && !isNaN(convertedToNumberVal)) {
      ret = convertedToNumberVal
    }

    if (fractationDigits !== undefined) {
      ret = new Decimal(ret).toDP(fractationDigits).toNumber()
    }

    return ret
  }

  /**
   * round value to X decimal places https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
   * 19.103857566765578635.toBe(19.1)
   * 19.143857566765578635.toBe(19.1)
   * 19.144857566765578635.toBe(19.1)
   * @param {*} value
   * @returns
   */
  static RoundNumber(value: number, decimalPlaces = 1) {
    const decimalPlacesMultiplier = Math.pow(10, decimalPlaces)
    return Math.round((value + Number.EPSILON) * decimalPlacesMultiplier) / decimalPlacesMultiplier
  }

  /**
   * Continuously call actionFn by setTimeout with interval. The next process will be schedule after current process completed (success or failed)
   * Interval can be determined (randomly) by intervalFn() and delay between execution can be vary.
   * @param actionFn support async function
   * @param DEFAULT_INTERVAL if nothing provided or callbackFn success, this is the interval for running. If adjustment happen, it will not exceed 2*DEFAULT_INTERVAL
   * @param intervalFn intervalFn(currentDelay, isPreviousRunSuccess, DEFAULT_INTERVAL). if currentDelay is undefined, should return the default. if currentDelay has value, should return next delay.
   * @param executeImmediately default = false. If true, invoke actionFn() immediately (in the beginning) when calling this function
   * @param shouldPerformActionFn shouldPerformActionFn(currentDelay, isPreviousRunSuccess, DEFAULT_INTERVAL). this function should return true if you want to perform actionFn when timeout happen.
   */
  static async ContinuousExecuteBySetTimeout(
    actionFn: Function,
    DEFAULT_INTERVAL: number = 10000,
    intervalFn?: (previousDelay: number, isPreviousRunSuccess: boolean, DEFAULT_INTERVAL: number) => number,
    executeImmediately = false,
    shouldPerformActionFn = (_0: number, _1?: boolean, _2?: number) => true
  ): Promise<{
    timerId: any
    delay: number
  }> {
    let ret = {
      timerId: undefined as any,
      delay: NaN,
    }

    if (!actionFn || typeof actionFn != 'function') {
      return ret
    }

    // use the default intervalFn
    if (typeof intervalFn != 'function') {
      intervalFn = CommonHelper.ContinuousExecuteBySetTimeoutDefaultIntervalFn
    }

    let delay = intervalFn(DEFAULT_INTERVAL, true, DEFAULT_INTERVAL)
    let isPreviousRunSuccess: boolean | undefined = undefined

    async function run() {
      try {
        if (shouldPerformActionFn(delay, isPreviousRunSuccess, DEFAULT_INTERVAL)) {
          await actionFn()
          isPreviousRunSuccess = true
        }
      } catch (error) {
        isPreviousRunSuccess = false
      }

      // calculate the new delay for the next run
      delay = intervalFn?.(delay, isPreviousRunSuccess || false, DEFAULT_INTERVAL) || DEFAULT_INTERVAL
      ret.delay = delay
      ret.timerId = setTimeout(run, delay)
      // console.debug(`${ret.delay} ${ret.timerId} after setTimeout`)
    }

    // run immediately when being called, not after wait for the first timeout
    if (executeImmediately && shouldPerformActionFn(delay, isPreviousRunSuccess, DEFAULT_INTERVAL)) {
      try {
        await actionFn()
        isPreviousRunSuccess = true
      } catch (error) {
        isPreviousRunSuccess = false
      }
    }
    ret.timerId = setTimeout(run, delay)
    // console.debug(`${ret.delay} ${ret.timerId} after setTimeout -------- INIT`)

    return ret
  }

  /**
   * Create a default delay number (calculate delay based on previous delay and isPreviousRunSuccess).
   * When calling ContinuousExecuteBySetTimeout() without intervalFn, this func will be used as default implementation.
   * PreviousRunSuccess ==> return DEFAULT_INTERVAL.
   * PreviousRunFailed ==> return random * (1.2 to 2.0) * DEFAULT_INTERVAL.
   * @param {*} previousDelay
   * @param {*} isPreviousRunSuccess
   * @returns
   */
  static ContinuousExecuteBySetTimeoutDefaultIntervalFn(previousDelay: number, isPreviousRunSuccess: boolean, DEFAULT_INTERVAL: number): number {
    if (isPreviousRunSuccess) {
      return DEFAULT_INTERVAL // job is done successfully, we back to use DEFAULT_INTERVAL (because prev delay (which is a failed one) can be (e.g. 12345ms), longer than DEFAULT_INTERVAL)
    }

    // adjust delay to be longer than previousDelay, but maximum is 2 * DEFAULT_INTERVAL
    let newDelay = previousDelay || DEFAULT_INTERVAL
    // increase delay, at least 20%
    newDelay = Math.round(newDelay * (1.2 + Math.random()))
    if (newDelay > 2 * DEFAULT_INTERVAL) {
      newDelay = 2 * DEFAULT_INTERVAL
    }
    // console.debug("change to different newDelay for next request:", newDelay)

    return newDelay
  }

  /** change 1 to 1️⃣ (unicode square box character) */
  static RepresentNumberInIconicDigit(numberString: string | null): string {
    if (!numberString) {
      return ''
    }

    let ret = numberString.toString()
    ret = ret
      .replace(/0/g, '0️⃣')
      .replace(/1/g, '1️⃣')
      .replace(/2/g, '2️⃣')
      .replace(/3/g, '3️⃣')
      .replace(/4/g, '4️⃣')
      .replace(/5/g, '5️⃣')
      .replace(/6/g, '6️⃣')
      .replace(/7/g, '7️⃣')
      .replace(/8/g, '8️⃣')
      .replace(/9/g, '9️⃣')

    return ret
  }

  /**
   * random an integer. Max = 10, so return 0 to 10
   * @param max the maximum number this func can return
   * @returns number integer
   */
  static GetRandomIntegerTo(max: number) {
    return this.GetRandomIntegerFromTo(0, max)
  }

  /**
   * random an integer, return value from min to max. (0,10) ==> return any integer from 0 to 10
   * @returns number integer
   */
  static GetRandomIntegerFromTo(min: number, max: number): number {
    const range = max - min + 1
    return Math.floor(Math.random() * range) + min
  }

  /**
   * return random element inside array
   * @param {*} arr
   * @returns
   */
  static GetRandomArrayElement(arr: any[]) {
    if (Array.isArray(arr)) {
      return arr[CommonHelper.GetRandomIntegerTo(arr.length - 1)]
    }
  }

  /**
   * This will modify the input array https://stackoverflow.com/a/2450976
   * @param {*} array
   * @returns
   */
  static ShuffleArray(array: any[]) {
    let currentIndex = array.length,
      randomIndex

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      // And swap it with the current element.
      ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array
  }

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
  static HasAnyOfIntersection(firstList: number | string | number[] | string[], otherList: number | string | number[] | string[] = '', ignoreCase = true) {
    if (!firstList || !otherList) return false

    const arrFirsts = _flatten([firstList]) // [""]   ==> [""], [[1,2]]   ==> [1,2]
    const arrEvaluations = _flatten([otherList]) // [""]   ==> [""], [[1,2]]   ==> [1,2]

    let ret
    if (ignoreCase) {
      ret =
        _intersectionWith(arrFirsts, arrEvaluations, (listVal, otherVal) => {
          if (typeof listVal === 'string' || typeof otherVal === 'string') {
            return listVal?.toString()?.toUpperCase() === otherVal?.toString()?.toUpperCase()
          }

          return listVal === otherVal
        }).length > 0
    } else {
      ret = _intersection(arrFirsts, arrEvaluations).length > 0
    }
    return ret
  }

  /**
   * return percent of portion to full, (25, 50) ==> 50
   */
  static Percent(portion: number, full: number, fractationDigits: number) {
    let ret = (100 * portion) / full

    if (fractationDigits > 0) {
      ret = CommonHelper.ToNumber(ret, fractationDigits)
    }
    return ret
  }

  /**
   * from 100 to 110, the diff is 10 (is 10%). This function returns 10
   * @returns null if from to is not number
   */
  static DiffInPercent(from: number, to: number, fractationDigits: number) {
    let ret = null

    if (_isNumber(from) && _isNumber(to)) {
      ret = CommonHelper.Percent(to - from, from, fractationDigits)
    }

    return ret
  }

  // =========== ===================== ===========
  // =========== string representation ===========
  // =========== ===================== ===========

  /**
   * join all arguments with "/" seperator.
   * E.g.: JoinPaths("a", b, c)
   */
  static JoinPaths(...parts: (string | number)[]) {
    var separator = '/'
    var replace = new RegExp(separator + '{1,}', 'g') // replace multiple to single separator
    return parts.join(separator).replace(replace, separator)
  }

  // =========== ===================== ===========
  // =========== string representation ===========
  // =========== ===================== ===========

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
  static ToNumberString(val?: number | string, fractationDigits = 2, showPrefixSign = false, showZeroVal = true, suffix = '') {
    if (val == 0 && !showZeroVal) {
      return ''
    }

    if (!val && val !== 0) {
      // NaN, undefined, null, ""
      return ''
    }

    const prefixSign = showPrefixSign && +val > 0 ? '+' : ''
    return prefixSign + CommonHelper.ToNumber(val, fractationDigits) + suffix
  }

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
  static NumberToUnitString(numberString: number | string, unitDividen = 1, fractationDigits = 0, unit = '', locale = 'en-US'): string {
    // empty string, or text string which is not a number, return
    if (numberString === 0) return '0'
    if (!numberString) return ''
    if (!+numberString) return numberString?.toString()

    let unitNumbers = (+numberString / unitDividen).toFixed(fractationDigits)
    return new Intl.NumberFormat(locale).format(+unitNumbers) + unit
  }

  // @deprecated

  /**
   * @deprecated since version 6.1.0
   * if now is 2002 12 31 14:22, this return 20021231.
   * @param {Date} date
   * @returns {string}
   */
  static GetCurrentYearMonthDayString = DateTimeHelper.GetCurrentYearMonthDayString

  /**
   * @deprecated since version 6.1.0
   * if now is 14:22, this return 1422.
   * 9:40AM ==> 0940
   * 16:03 (PM) ==> 1603
   * @param {Date} date
   * @returns {string}
   */
  static GetCurrentHoursMinutesString = DateTimeHelper.GetCurrentHoursMinutesString

  /**
   * @deprecated since version 6.1.0
   * if now is 14:22:59, this return 142259.
   * 9:40AM ==> 094000
   * 16:03 (PM) ==> 160300
   */
  static GetCurrentHoursMinutesSecondsString = DateTimeHelper.GetCurrentHoursMinutesSecondsString

  /**
   * @deprecated since version 6.1.0
   * @returns string the Date string in format yyyyMMdd (in UTC timezone)
   */
  static GetCurrentYearMonthDayStringUTC = DateTimeHelper.GetCurrentYearMonthDayStringUTC

  /**
   * @deprecated since version 6.1.0
   * @returns string the Time string in format HHmm (in UTC timezone)
   */
  static GetCurrentHoursMinutesStringUTC = DateTimeHelper.GetCurrentHoursMinutesStringUTC

  /**
   * @deprecated since version 6.1.0
   * @returns string the Time string in format HHmmss (in UTC timezone)
   */
  static GetCurrentHoursMinutesSecondsStringUTC = DateTimeHelper.GetCurrentHoursMinutesSecondsStringUTC

  /**
   * @deprecated since version 6.1.0
   * return current date time in full format, in specific culture (language) and timezone
   * @param {*} culture
   * @param {*} timezone
   * @returns
   */
  static GetDatetimeNowString = DateTimeHelper.GetDatetimeNowString
}

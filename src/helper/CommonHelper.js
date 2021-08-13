import _intersection from "lodash/intersection"
import _intersectionWith from "lodash/intersectionWith"
import _isNumber from "lodash/isNumber"
import _flatten from "lodash/flatten"
const Decimal = require("decimal.js")

export default class CommonHelper {
  /**
   * @deprecated use ToNumber() TODO: remove this
   */
  static ToActualNumber(val) {
    return CommonHelper.ToNumber(val)
  }

  /**
   * @deprecated use ToNumber() TODO: remove this
   */
  static FormatNumber(numberString, fractationDigits = 0) {
    return CommonHelper.ToNumber(numberString, fractationDigits)
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
   * Continuously call actionFn by setTimeout with interval. The next process will be schedule after current process completed (success or failed)
   * Interval can be determined (randomly) by intervalFn() and delay betwen execution can be vary.
   * @param {*} actionFn support async function
   * @param {*} DEFAULT_INTERVAL if nothing provided or callbackFn success, this is the interval for running. If adjustment happen, it will not exceed 2*DEFAULT_INTERVAL
   * @param {*} intervalFn intervalFn(currentDelay, isPreviousRunSuccess). if currentDelay is undefined, should return the default. if currentDelay has value, should return next delay.
   */
  static ContinuousExecuteBySetTimeout(actionFn, DEFAULT_INTERVAL = 10000, intervalFn) {
    if (!actionFn || typeof actionFn != "function") {
      return
    }

    // use the default intervalFn
    if (typeof intervalFn != "function") {
      intervalFn = CommonHelper.ContinuousExecuteBySetTimeoutDefaultIntervalFn
    }

    let delay = intervalFn(undefined, true, DEFAULT_INTERVAL)
    let isPreviousRunSuccess = true
    let ret = {
      timerId: -1,
      delay,
    }

    async function run() {
      try {
        await actionFn()
        isPreviousRunSuccess = true
      } catch (error) {
        isPreviousRunSuccess = false
      }

      // calculate the new delay for the next run
      delay = intervalFn(delay, isPreviousRunSuccess, DEFAULT_INTERVAL)
      ret.delay = delay
      ret.timerId = setTimeout(run, delay)
      // console.debug(`${ret.delay} ${ret.timerId} after setTimeout`)
    }

    ret.timerId = setTimeout(run, delay)
    // console.debug(`${ret.delay} ${ret.timerId} after setTimeout -------- INIT`)

    return ret
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

  /**
   * change 1 to 1️⃣ (unicode square box character)
   * @param {*} numberString
   * @returns string
   */
  static RepresentNumberInIconicDigit(numberString) {
    if (!numberString) {
      return ""
    }

    let ret = numberString.toString()
    ret = ret
      .replace("0", "0️⃣")
      .replace("1", "1️⃣")
      .replace("2", "2️⃣")
      .replace("3", "3️⃣")
      .replace("4", "4️⃣")
      .replace("5", "5️⃣")
      .replace("6", "6️⃣")
      .replace("7", "7️⃣")
      .replace("8", "8️⃣")
      .replace("9", "9️⃣")

    return ret
  }

  /**
   * if now is 14:22, this return 1422.
   * 9:40AM ==> 0940
   * 16:03 (PM) ==> 1603
   * @param {Date} date
   * @returns
   */
  static GetCurrentHoursMinutesString(date) {
    if (!date) date = new Date()
    let currentHoursMinutesString =
      date
        .getHours()
        .toString()
        .padStart(2, 0) +
      "" +
      date
        .getMinutes()
        .toString()
        .padStart(2, 0)

    return currentHoursMinutesString
  }

  /**
   * if now is 14:22:59, this return 142259.
   * 9:40AM ==> 094000
   * 16:03 (PM) ==> 160300
   */
  static GetCurrentHoursMinutesSecondsString(date) {
    if (!date) date = new Date()

    let ret =
      CommonHelper.GetCurrentHoursMinutesString(date) +
      date
        .getSeconds()
        .toString()
        .padStart(2, 0)

    return ret
  }

  /**
   * return current date time in full format, in specific culture (language) and timezone
   * @param {*} culture
   * @param {*} timezone
   * @returns
   */
  static GetDatetimeNowString(culture = "vi-VN", timezone = "Asia/Saigon") {
    return new Intl.DateTimeFormat(culture, { timezone, dateStyle: "full", timeStyle: "long", hour12: false }).format(new Date())
    // _calculatedCWData_lastUpdated = new Date().toLocaleString("vi-VN", { timezone: "Asia/Saigon", hour12: false })
  }

  /**
   * random an int number, maximum is max - 1. Max = 10, so return 0 to 10
   * @param {*} max
   * @returns number integer
   */
  static GetRandomIntegerTo(max) {
    return Math.round(Math.random() * max)
  }

  /**
   * return random element inside array
   * @param {*} arr
   * @returns
   */
  static GetRandomArrayElement(arr) {
    if (Array.isArray(arr)) {
      return arr[CommonHelper.GetRandomIntegerTo(arr.length - 1)]
    }
  }

  /**
   * check for intersection.
   * E.g.: [a,b,c], a ==> true
   * E.g.: [a,b,c], [a] ==> true
   * E.g.: [a,b,c], [A], true ==> true, a==A because of ignoreCase
   *
   * value (which is not string) is compared by === (null === null, undefined === undefined)
   * @param {*} firstList
   * @param {*} otherList accept single value or array
   * @param {*} ignoreCase for string value (of either side), ignore case when comparing
   * @returns boolean true if there is an intersection
   */
  static HasAnyOfIntersection(firstList, otherList = "", ignoreCase = true) {
    if (!firstList || !otherList) return false

    const arrFirsts = _flatten([firstList]) // [""]   ==> [""], [[1,2]]   ==> [1,2]
    const arrEvaluations = _flatten([otherList]) // [""]   ==> [""], [[1,2]]   ==> [1,2]

    let ret
    if (ignoreCase) {
      ret =
        _intersectionWith(arrFirsts, arrEvaluations, (listVal, otherVal) => {
          if (typeof listVal === "string" || typeof otherVal === "string") {
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
   * return percent of portion to full, 25 50 ==> 50
   * @param {*} portion
   * @param {*} full
   * @param {*} fractationDigits
   * @returns number
   */
  static Percent(portion, full, fractationDigits) {
    let ret = (100 * portion) / full

    if (fractationDigits > 0) {
      ret = CommonHelper.FormatNumber(ret, fractationDigits)
    }
    return ret
  }

  /**
   * from 100 to 110, the diff is 10, and is 10%. Return 10
   * @param {*} from
   * @param {*} to
   * @returns null if from to is not number
   */
  static DiffInPercent(from, to, fractationDigits) {
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
   * @returns String
   */
  static JoinPaths() {
    const parts = Array.prototype.slice.call(arguments) // make array from arguments

    var separator = "/"
    var replace = new RegExp(separator + "{1,}", "g")
    return parts.join(separator).replace(replace, separator)
  }

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
      return ""
    }

    if (!val && val !== 0) {
      // NaN, undefined, null, ""
      return ""
    }

    const prefixSign = showPrefixSign && val > 0 ? "+" : ""

    return prefixSign + CommonHelper.FormatNumber(val, fractationDigits) + suffix
  }

  /**
   * display 1000000 as 1tr, 1000 as 1k
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
    // empty string, or text string which is not a number, return
    if (numberString === 0) return "0"
    if (!numberString) return ""
    if (!+numberString) return numberString?.toString()

    let unitNumbers = (+numberString / unitDividen).toFixed(fractationDigits)
    return new Intl.NumberFormat(locale).format(+unitNumbers) + unit
  }

  // =========== ===================== ===========
  // =========== string representation ===========
  // =========== ===================== ===========
  /**
   * @deprecated use ToNumber()
   * Round number to 2 digit. 1.22222 => 1.22
   * @param {*} num
   */
  static roundToTwo(num) {
    return CommonHelper.ToNumber(num, 2)
  }
}

import _intersection from "lodash/intersection"
import _isNumber from "lodash/isNumber"
import _flatten from "lodash/flatten"
const Decimal = require("decimal.js")

export default class CommonHelper {
  /**
   * If val can be treated/seen as real actual number (0, 1, 1.1, -1), return val as number.
   * Anything else (NaN, string "ABC") will be convert to 0
   * @param {*} val
   * @returns number
   */
  static ToActualNumber(val) {
    let ret = 0

    const convertedToNumberVal = +val
    // note that isNumber(NaN) == true
    if (_isNumber(convertedToNumberVal) && !isNaN(convertedToNumberVal)) {
      ret = convertedToNumberVal
    }

    return ret
  }

  /**
   * if provide a number, this will display 1000 as 1,000
   * if provided a string ("AT, ATC, ATO") return as is
   * vi-VN default thounsand separator is ,
   * @param {string} numberString
   * @param {number} fractationDigits number of decimal digit
   * @param {string} locale
   * @returns number
   */
  static FormatNumber(numberString, fractationDigits = 0) {
    return new Decimal(numberString || 0).toDP(fractationDigits).toNumber()
  }

  /**
   * // TODO: move to StockHelper
   * StockCompany represent 1000000 (1 million) as 1,000,000
   * We need to convert it to 1000000
   * @param {*} numberString
   */
  static StandardizeVolNumber(numberString) {
    if (typeof numberString === "number") {
      return numberString
    }

    // undefined or null
    if (!numberString) {
      return numberString
    }

    let ret
    if (typeof numberString === "string") {
      ret = numberString.replace(/,/g, "")
    }
    // else{
    //   // is number, do nothing
    // }

    // TODO: return ToActualNumber()
    return +ret
  }

  /**
   * Continuously call actionFn by setTimeout with interval. The next process will be schedule after current process completed (success or failed)
   * Interval can be determined (randomly) by intervalFn() and delay betwen execution can be vary.
   * @param {*} actionFn support async function
   * @param {*} intervalFn intervalFn(currentDelay, isPreviousRunSuccess). if currentDelay is undefined, should return the default. if currentDelay has value, should return next delay.
   * @param {*} DEFAULT_INTERVAL if nothing provided or callbackFn success, this is the interval for running. If adjustment happen, it will not exceed 2*DEFAULT_INTERVAL
   */
  static ContinuousExecuteBySetTimeout(actionFn, DEFAULT_INTERVAL = 10000, intervalFn) {
    if (!actionFn || typeof actionFn != "function") {
      return
    }

    // provide the default intervalFn
    if (typeof intervalFn != "function") {
      // create a default function/behaviour, calculate delay based on previous delay and isPreviousRunSuccess
      intervalFn = (previousDelay, isPreviousRunSuccess) => {
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
    }

    let delay = intervalFn(undefined, true)
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
      delay = intervalFn(delay, isPreviousRunSuccess)
      ret.delay = delay
      ret.timerId = setTimeout(run, delay)
      // console.debug(`${ret.delay} ${ret.timerId} after setTimeout`)
    }

    ret.timerId = setTimeout(run, delay)
    // console.debug(`${ret.delay} ${ret.timerId} after setTimeout -------- INIT`)

    return ret
  }

  /**
   * continuous checkWorkingHours and call callbackFn with interval
   * @param {*} callbackFn
   * @param {*} interval
   */
  static ContinuousExecuteInWorkingHours(callbackFn, interval) {
    if (!callbackFn) {
      return
    }

    let timerId = setInterval(async () => {
      // only perform callback in trading hours
      if (CommonHelper.IsInWorkingHours() && CommonHelper.IsInWorkingDays()) {
        await callbackFn()
      } else {
        // console.debug(now, "out of trading hour, I don't refresh signal to save network consumption")
      }
    }, interval)

    return timerId
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
   *
   * @param {String} now hhhmm string, like "1130" or "0959"
   * @returns boolean
   */
  static IsInWorkingHours(now) {
    if (!now) {
      now = CommonHelper.GetCurrentHoursMinutesString()
    }

    if (("0845" <= now && now <= "1130") || ("1300" <= now && now <= "1445")) {
      return true
    } else {
      return false
    }
  }

  /**
   *  is in ATO sessions
   * @param {String} now hhhmm string, like "1130" or "0959"
   */
  static IsIn_ATO_Sessions(now) {
    if (!now) {
      now = CommonHelper.GetCurrentHoursMinutesString()
    }

    if ("0845" <= now && now <= "0915") {
      return true
    }

    return false
  }
  /**
   *  is in ATC sessions
   * @param {String} now hhhmm string, like "1130" or "0959"
   */
  static IsIn_ATC_Sessions(now) {
    if (!now) {
      now = CommonHelper.GetCurrentHoursMinutesString()
    }

    if ("1430" <= now && now <= "1445") {
      return true
    }

    return false
  }

  /**
   * return true if current moment is Monday to Friday
   * @param {Date} now
   */
  static IsInWorkingDays(now) {
    if (!now) {
      now = new Date()
    }

    let currentDay = now.getDay() // // Sunday - Saturday : 0 - 6
    if (0 < currentDay && currentDay < 6) {
      return true
    } else {
      return false
    }
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
   * return random element inside array
   * @param {*} arr
   * @returns
   */
  static GetRandomArrayElement(arr) {
    if (Array.isArray(arr)) {
      return arr[Math.round(Math.random() * arr.length - 1)]
    }
  }

  /**
   * check for intersection.
   * E.g.: [a,b,c], a ==> true
   * E.g.: [a,b,c], [a] ==> true
   * @param {*} array1
   * @param {*} evaluationToCheck accept single value or array
   * @returns boolean true if there is an intersection
   */
  static HasAnyOfIntersection(array1, evaluationToCheck = "") {
    const arrEvaluations = _flatten([evaluationToCheck]) // [""]   ==> [""], [[1,2]]   ==> [1,2]
    return _intersection(array1, arrEvaluations).length > 0
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
   * @param {number | string} numberString original number (string) to format. This string must be able to convert to number.
   * @param {number} unitDividen dividen divide number to this
   * @param {number} fractationDigits default is 0 (1000 --> 1,000). if 1, 1000,1 --> 1,000.1
   * @param {string} unit default is "tr" (triệu đồng VN)
   * @param {string} locale "en-US" "vi-VN"
   * @returns string
   */
  static NumberToUnitString(numberString, unitDividen = 1, fractationDigits = 0, unit = "", locale = "en-US") {
    // empty string, or text string which is not a number, return
    if (!numberString) return
    if (!+numberString) return

    let unitNumbers = (+numberString / unitDividen).toFixed(fractationDigits)
    return new Intl.NumberFormat(locale).format(+unitNumbers) + unit
  }
}

import _intersection from "lodash/intersection"
import _intersectionWith from "lodash/intersectionWith"
import _isNumber from "lodash/isNumber"
import _flatten from "lodash/flatten"
import { CommonHelper } from "./CommonHelper"

export class StockvnHelper {
  /**
   * StockCompany usually represent 1000000 (1 million) as 1,000,000
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

    return CommonHelper.ToNumber(ret)
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
      if (this.IsInWorkingHours() && this.IsInWorkingDays()) {
        await callbackFn()
      } else {
        // console.debug(now, "out of trading hour, I don't refresh signal to save network consumption")
      }
    }, interval)

    return timerId
  }

  /**
   * from "now", if in working day, get hhmm time in hhmm format, like "1130" or "0959", then check
   * @param {Date} now
   * @returns boolean
   */
  static IsInWorkingHours(now) {
    if (!now) {
      now = new Date()
    }

    if (!StockvnHelper.IsInWorkingDays(now)) return false

    const hhmm = CommonHelper.GetCurrentHoursMinutesString(now)
    if (("0845" <= hhmm && hhmm <= "1130") || ("1300" <= hhmm && hhmm <= "1445")) {
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
}

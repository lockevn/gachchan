import { flatten as _flatten, isNumber as _isNumber, intersectionWith as _intersectionWith, intersection as _intersection } from 'lodash'
import { CommonHelper } from './CommonHelper'
import { DateTimeHelper } from './DateTimeHelper'

export class StockvnHelper {
  /**
   * StockCompany usually represent 1000000 (1 million) as 1,000,000
   * We need to convert it to 1000000
   * @param num
   */
  static StandardizeVolNumber(num: string | number): number {
    if (typeof num === 'number') {
      return num as number
    }

    // undefined or null
    if (!num) {
      return NaN
    }

    let ret = ''
    if (typeof num === 'string') {
      ret = num.replace(/,/g, '')
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
  static ContinuousExecuteInWorkingHours(callbackFn: Function, interval: number) {
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

  /** return current `hhmm` timestring in GMT7 timezone */
  static getCurrentGMT7HoursMinutesString() {
    const gmt7time = DateTimeHelper.GetTimeInGMTTimezone(7)
    const hhmm = DateTimeHelper.GetCurrentHoursMinutesString(gmt7time)
    return hhmm
  }

  /** return current `hhmmss` timestring in GMT7 timezone */
  static getCurrentGMT7HoursMinutesSecondsString() {
    const gmt7time = DateTimeHelper.GetTimeInGMTTimezone(7)
    const hhmmss = DateTimeHelper.GetCurrentHoursMinutesSecondsString(gmt7time)
    return hhmmss
  }

  /**
   * from "now", if in working day, get hhmm time in hhmm format, like "1130" or "0959", then check
   * @param {Date} now
   * @returns boolean
   */
  static IsInWorkingHours() {
    if (!this.IsInWorkingDays()) {
      return false
    }

    const hhmm = this.getCurrentGMT7HoursMinutesString()
    if (('0845' <= hhmm && hhmm <= '1130') || ('1300' <= hhmm && hhmm <= '1445')) {
      return true
    } else {
      return false
    }
  }

  /**
   *  is in ATO sessions
   * @param {String} nowString hhhmm string, like "1130" or "0959"
   */
  static IsIn_ATO_Sessions(nowString?: string) {
    if (!nowString) {
      nowString = this.getCurrentGMT7HoursMinutesString()
    }

    if ('0845' <= nowString && nowString <= '0915') {
      return true
    }

    return false
  }
  /**
   *  is in ATC sessions
   * @param {String} nowString hhhmm string, like "1130" or "0959"
   */
  static IsIn_ATC_Sessions(nowString?: string) {
    if (!nowString) {
      nowString = this.getCurrentGMT7HoursMinutesString()
    }

    if ('1430' <= nowString && nowString <= '1445') {
      return true
    }

    return false
  }

  /**
   * return true if current moment is Monday to Friday (Vietnam working days) in GMT+7 timezone
   */
  static IsInWorkingDays() {
    const gmt7time = DateTimeHelper.GetTimeInGMTTimezone(7)

    // Sunday - Saturday : 0 - 6
    const currentDay = gmt7time.getDay()
    if (0 < currentDay && currentDay < 6) {
      return true
    }

    return false
  }

  /**
   * return true if s is like HNXINDEX, I3-FIN
   * @param str SymbolCode (HPG, HNXINDEX, I3-FIN)
   */
  static IsCompoundIndexSymbolCode(str: string) {
    if (str.search(/^I\d\-/i) == 0) {
      return true
    }

    if (str.search(/INDEX/) >= 0) {
      return true
    }

    return false
  }
}

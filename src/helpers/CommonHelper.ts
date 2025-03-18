import _flatten from 'lodash/flatten.js'
import _isNumber from 'lodash/isNumber.js'
import _isFinite from 'lodash/isFinite.js'
import _intersectionWith from 'lodash/intersectionWith.js'
import _intersection from 'lodash/intersection.js'

import Decimal from 'decimal.js'

export class CommonHelper {
  /**
   * if provide a number or number-string, this will return a number, with fractationDigits
   * if provided a string ("AT, ATC, ATO") throw exception
   * NonNumberValue like null, undefined and NaN is treat as 0
   * @param {string} numberString
   * @param {number} fractationDigits number of decimal digit
   * @returns number
   */
  static toNumber(numberString: number | string, fractationDigits: number = 2, treatNonNumberValueAs = 0) {
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
  static roundNumber(value: number, decimalPlaces = 1) {
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
  static async continuousExecuteBySetTimeout(
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
      intervalFn = CommonHelper.continuousExecuteBySetTimeoutDefaultIntervalFn
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
  static continuousExecuteBySetTimeoutDefaultIntervalFn(previousDelay: number, isPreviousRunSuccess: boolean, DEFAULT_INTERVAL: number): number {
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

  /** by combining ISOTimeString and nanoid */
  static createRandomString() {
    return `${new Date().toISOString().substring(0, 10)}_${nanoid()}`
  }

  /**
   * random an integer. Max = 10, so return 0 to 10
   * @param max the maximum number this func can return
   * @returns number integer
   */
  static getRandomIntegerTo(max: number) {
    return this.getRandomIntegerWithin(0, max)
  }

  /**
   * random an integer, return value from min to max (include min and max). (0,10) ==> return any integer from 0 to 10
   * @returns number integer
   */
  static getRandomIntegerWithin(min: number, max: number): number {
    const range = max - min + 1
    return Math.floor(Math.random() * range) + min
  }

  /**
   * return random element inside array
   * @param {*} arr
   * @returns
   */
  static getRandomArrayElement(arr: any[]) {
    if (Array.isArray(arr)) {
      return arr[CommonHelper.getRandomIntegerTo(arr.length - 1)]
    }
  }

  /**
   * This will modify the input array https://stackoverflow.com/a/2450976
   * @param {*} array
   * @returns
   */
  static shuffleArray(array: any[]) {
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
  static hasAnyOfIntersection(firstList: number | string | (number | string)[], otherList: number | string | (number | string)[] = '', ignoreCase = true) {
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
   * merge 2 arrays of entries and reduce to distinct
   * [1,2,3] & [2, 3, 4] ==> return [1,2,3,4]
   * @param {Array} arr1
   * @param {Array} arr2
   */
  static mergeAndDistinct(arr1: any[], arr2: any[]) {
    function onlyUnique(value: any, index: number, self: any[]) {
      return self.indexOf(value) === index
    }

    let distinctArrayOfRoles = arr1.concat(arr2).filter(onlyUnique)
    return distinctArrayOfRoles
  }

  /**
   * return percent of portion to full, (25, 50) ==> 50
   */
  static percent(portion: number, full: number, fractationDigits?: number) {
    let ret = (100 * portion) / full
    return CommonHelper.toNumber(ret, fractationDigits)
  }

  /**
   * from 100 to 110, the diff is 10 (is 10%). This function returns 10
   * @returns null if from to is not number
   */
  static diffInPercent(from: number, to: number, fractationDigits?: number) {
    let ret = null

    if (_isFinite(from) && _isFinite(to)) {
      ret = CommonHelper.percent(to - from, from, fractationDigits)
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
  static joinPaths(...parts: (string | number | null | undefined)[]) {
    var separator = '/'
    var replace = new RegExp(separator + '{1,}', 'g') // replace multiple to single separator
    return parts
      .filter((p) => p)
      .join(separator)
      .replace(replace, separator)
  }

  /**
   * Checks if a string is a valid URL.
   * @param str The string to check.
   */
  static isURL(str: string): boolean {
    try {
      new URL(str)
      return true
    } catch (error) {
      return false
    }
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
  static toNumberString(val?: number | string, fractationDigits = 2, showPrefixSign = false, showZeroVal = true, suffix = '') {
    if (val == 0 && !showZeroVal) {
      return ''
    }

    if (!val && val !== 0) {
      // NaN, undefined, null, ""
      return ''
    }

    const prefixSign = showPrefixSign && +val > 0 ? '+' : ''
    return prefixSign + CommonHelper.toNumber(val, fractationDigits) + suffix
  }

  /**
   * display 1000000 as 1tr, 1000 as 1k
   * display 1000000 as 1,000,000 (when using en-US locale)
   * Also round the number after converting (100400 ==> 100k, 100500 ==> 101k)
   * vi-VN default thounsand separator is ,
   * 0 will be returned as "0"
   * NaN or "" will be returned as ""
   * "ATC" (which is cannot be converted to number) will be returned as is "ATC"
   * @param numberString original number (string) to format. This string must be able to convert to number.
   * @param unitDividen dividen divide number to this
   * @param fractationDigits default is 0 (1000 --> 1,000). if 1, 1000,1 --> 1,000.1
   * @param unit default is "tr" (triệu đồng VN)
   * @param locale "en-US" "vi-VN"
   */
  static numberToUnitString(numberString: number | string, unitDividen = 1, fractationDigits = 0, unit = '', locale = 'en-US'): string {
    // empty string, or text string which is not a number, return
    if (numberString === 0) return '0'
    if (!numberString) return ''
    if (!+numberString) return numberString?.toString()

    let unitNumbers = (+numberString / unitDividen).toFixed(fractationDigits)
    return new Intl.NumberFormat(locale).format(+unitNumbers) + unit
  }

  /** convert camelCase to snake_case
   * @example someHereIsGood ==> some_here_is_good. CAPITALIZED ==> c_a_p_i_t_a_l_i_z_e_d
   */
  static camelToSnakeCase(str: string): string {
    const snakeCase = str.replace(/([A-Z])/g, (match, p1) => `_${p1.toLowerCase()}`)

    return snakeCase.startsWith('_') ? snakeCase.slice(1) : snakeCase
  }

  /** (from source), create new object contains mapped fields.
   * @example {a:1, b:2, c:3} with map {a:AA, b:BB} ==> {AA:1, BB:2} (and omit c:3)
   */
  static objectMapKeys(source: Record<string, any>, keyMap: Record<string, string>) {
    return Object.entries(keyMap).reduce((o, [key, newKey]) => {
      o[newKey] = source[key]
      return o
    }, {} as any)
  }

  /**
   * Convert snake_case to camelCase
   * @param str
   * @returns
   */
  static toCamelCase(str: string): string {
    if (!str) return str // empty string case

    const cleanedStr = str.startsWith('_') ? str.substring(1) : str // Handle leading underscore by removing it first
    return cleanedStr.replace(/_./g, (match) => match.charAt(1).toUpperCase())
  }

  /**
   * Recursively converts object keys from snake_case to camelCase
   * @param objOrArray object or array
   * @returns Transformed object/array with camelCase keys
   */
  static convertKeysToCamelCase(objOrArray: any[] | object): any[] | object {
    if (!objOrArray) return objOrArray

    if (Array.isArray(objOrArray)) {
      return objOrArray.map(CommonHelper.convertKeysToCamelCase) // Recursively apply to array elements
    }

    if (objOrArray !== null && typeof objOrArray === 'object') {
      return Object.keys(objOrArray).reduce((acc: Record<string, any>, key: string) => {
        const camelKey = CommonHelper.toCamelCase(key) // Convert key to camelCase
        acc[camelKey] = CommonHelper.convertKeysToCamelCase((objOrArray as Record<string, any>)[key]) // Recursively handle nested objects
        return acc
      }, {})
    }

    return objOrArray // If it's not an object or array, return as-is
  }

  /**
   * split string into array, remove empty entries, each output string is trimmed
   * "1,2,3 ,,, 4, 5 ,6" ==> [1,2,3,4,5,6]
   * @param strCommaSeparated
   */
  static splitByCommaAndTrim(strCommaSeparated?: string) {
    if (strCommaSeparated) {
      return strCommaSeparated
        .split(',')
        .filter((segment) => segment)
        .map((e) => e.trim())
    } else {
      return []
    }
  }

  /**
   * give you the Date object, from the jsonDateString (return from some API services)
   * @param jsonDateString string of this format "/Date(2342353453434)/"
   */
  static parseJsonDate(jsonDateString: string) {
    return new Date(parseInt(jsonDateString.replace('/Date(', '').replace(')/', '')))
  }

  // #region @deprecated
  //
  // #endregion
}

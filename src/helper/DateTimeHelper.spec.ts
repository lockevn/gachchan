import { test, assert, expect, it, describe, beforeAll, afterAll, vi } from "vitest"

import { DateTimeHelper } from "./DateTimeHelper"
const target = DateTimeHelper

describe("DateTimeHelper", () => {
  describe("Mocking date times", () => {
    beforeAll(() => {
      // https://stackoverflow.com/questions/28504545/how-to-mock-a-constructor-like-new-date/65548068#65548068
      vi.setSystemTime(new Date("2020-01-01 00:00:000Z"))
    })
    afterAll(() => {
      vi.useRealTimers()
    })

    it("GetCurrentYearMonthDayString", () => {
      expect(target.GetCurrentYearMonthDayString(new Date("2000-12-31 10:01:59"))).toBe("20001231")
    })

    it("GetCurrentHoursMinutesString", () => {
      expect(target.GetCurrentHoursMinutesString(new Date("2000-01-01 10:01:59"))).toBe("1001")
      expect(target.GetCurrentHoursMinutesString(new Date("2000-01-01 00:11:59"))).toBe("0011")
    })
    it("GetCurrentHoursMinutesSecondsString", () => {
      expect(target.GetCurrentHoursMinutesSecondsString(new Date("2000-01-01 00:00:00"))).toBe("000000")
      expect(target.GetCurrentHoursMinutesSecondsString(new Date("2000-01-01 11:59:59"))).toBe("115959")
    })

    it("GetCurrent date and time string, in UTC", () => {
      expect(target.GetCurrentHoursMinutesStringUTC(new Date("2000-01-01 06:00:00"))).toBe("2300")
      expect(target.GetCurrentHoursMinutesSecondsStringUTC(new Date("2000-01-01 06:00:00"))).toBe("230000")
      expect(target.GetCurrentYearMonthDayStringUTC(new Date("2000-01-01 06:00:00"))).toBe("19991231")
    })

    it("GetDatetimeNowString", () => {
      expect(target.GetDatetimeNowString()).toBe("07:00:00 GMT+7 Thứ Tư, 1 tháng 1, 2020")
    })

    it("GetTimeInGMTTimezone", () => {
      // 76AM in GMT, is 11hPM yesterday in GMT
      expect(target.GetTimeInGMTTimezone(7)).toEqual(new Date("2020-01-01T00:00:00.000Z"))
    })
  })
})

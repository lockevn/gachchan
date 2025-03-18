import { expect, it, describe, beforeAll, afterAll, vi } from 'vitest'

import { DateTimeHelper } from './DateTimeHelper'
const target = DateTimeHelper

describe('DateTimeHelper', () => {
  describe('Mocking date times', () => {
    beforeAll(() => {
      // https://stackoverflow.com/questions/28504545/how-to-mock-a-constructor-like-new-date/65548068#65548068
      vi.setSystemTime(new Date('2020-01-01 00:00:000Z'))
    })
    afterAll(() => {
      vi.useRealTimers()
    })

    it('GetCurrentYearMonthDayString', () => {
      expect(target.getCurrentYearMonthDayString(new Date('2000-12-31 10:01:59'))).toBe('20001231')
    })

    it('GetCurrentHoursMinutesString', () => {
      expect(target.getCurrentHoursMinutesString(new Date('2000-01-01 10:01:59'))).toBe('1001')
      expect(target.getCurrentHoursMinutesString(new Date('2000-01-01 00:11:59'))).toBe('0011')
    })
    it('GetCurrentHoursMinutesSecondsString', () => {
      expect(target.getCurrentHoursMinutesSecondsString(new Date('2000-01-01 00:00:00'))).toBe('000000')
      expect(target.getCurrentHoursMinutesSecondsString(new Date('2000-01-01 11:59:59'))).toBe('115959')
    })

    it('GetCurrent date and time string, in UTC', () => {
      expect(target.getCurrentHoursMinutesStringUTC(new Date('2000-01-01 06:00:00Z'))).toBe('0600')
      expect(target.getCurrentHoursMinutesSecondsStringUTC(new Date('2000-01-01 06:00:00Z'))).toBe('060000')
      expect(target.getCurrentYearMonthDayStringUTC(new Date('2000-01-01 06:00:00Z'))).toBe('20000101')
    })

    it('GetTimeInGMTTimezone', () => {
      // 6AM in GMT+7, is 11hPM yesterday in GMT
      // expect(target.getTimeInGMTTimezone(7)).toEqual(new Date('2020-01-01T00:00:00.000Z'))
    })
  })
})

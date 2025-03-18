import { test, assert, expect, it, describe, beforeAll, afterAll } from 'vitest'
import { StockvnHelper } from './StockvnHelper'

const target = StockvnHelper

describe('StockvnHelper', () => {
  beforeAll(async () => {})

  it('StandardizeVolNumber', () => {
    expect(target.standardizeVolNumber('')).toBeNaN()

    expect(target.standardizeVolNumber('0')).toBe(0)
    expect(target.standardizeVolNumber(0)).toBe(0)

    expect(target.standardizeVolNumber('1000')).toBe(1000)
    expect(target.standardizeVolNumber('1,000')).toBe(1000)
    expect(target.standardizeVolNumber('1,000,000.11')).toBe(1000000.11)

    expect(target.standardizeVolNumber(1000)).toBe(1000)
    expect(target.standardizeVolNumber(1000.11)).toBe(1000.11)
  })

  it('isCompoundIndexSymbolCode', () => {
    expect(target.isCompoundIndexSymbolCode('I3-FIN')).toBeTruthy()
    expect(target.isCompoundIndexSymbolCode('HNXINDEX')).toBeTruthy()

    expect(target.isCompoundIndexSymbolCode('HPG')).toBeFalsy()
    expect(target.isCompoundIndexSymbolCode('TCB')).toBeFalsy()
  })

  describe('Mocking times', () => {
    it('IsInWorkingHours in working day', () => {
      const dateMondayVN = new Date('2024-05-27T03:10:10.100Z')
      vi.setSystemTime(dateMondayVN)
      expect(target.isInWorkingHours()).toBe(true)

      const dateMondayVN0845 = new Date('2024-05-27T01:45:00.000Z')
      vi.setSystemTime(dateMondayVN0845)
      expect(target.isInWorkingHours()).toBe(true)
    })

    it('IsInWorkingHours in weekend', () => {
      const dateSaturday = new Date('2021-07-31 23:15:30 GMT+11:00')
      vi.setSystemTime(dateSaturday)
      expect(target.isInWorkingHours()).toBe(false)
    })

    it('IsInWorkingHours in working day, but too early', () => {
      const dateMondayVN0844 = new Date('2024-05-27T01:44:00.000Z')
      vi.setSystemTime(dateMondayVN0844)
      expect(target.isInWorkingHours()).toBe(false)

      const dateFridayTooEarly = new Date('2024-05-31 06:15:30 GMT+07:00')
      vi.setSystemTime(dateFridayTooEarly)
      expect(target.isInWorkingHours()).toBe(false)

      const dateMondayInVietnamAndUKTooEarly = new Date('2024-05-27 07:15:30 GMT+07:00')
      vi.setSystemTime(dateMondayInVietnamAndUKTooEarly)
      expect(target.isInWorkingHours()).toBe(false)

      const dateMondayInVietnamButSundayInUK = new Date('2024-05-27 06:15:30 GMT+07:00')
      vi.setSystemTime(dateMondayInVietnamButSundayInUK)
      expect(target.isInWorkingHours()).toBe(false)
    })

    it('IsIn_ATO_Sessions', () => {
      expect(target.isIn_ATO_Sessions('0900')).toBe(true)
      expect(target.isIn_ATO_Sessions('0914')).toBe(true)

      expect(target.isIn_ATO_Sessions('1100')).toBe(false)
    })

    it('IsIn_ATC_Sessions', () => {
      expect(target.isIn_ATC_Sessions('1430')).toBe(true)
      expect(target.isIn_ATC_Sessions('1445')).toBe(true)

      expect(target.isIn_ATC_Sessions('1446')).toBe(false)
    })

    it('IsInWorkingDays', () => {
      const dateFridayInUKandVN = new Date('2024-05-31 00:00:000Z')
      vi.setSystemTime(dateFridayInUKandVN)
      expect(target.isInWorkingDays()).toBe(true)

      const dateFridayLastMinute = new Date('2024-05-31 16:59:000Z')
      vi.setSystemTime(dateFridayLastMinute)
      expect(target.isInWorkingDays()).toBe(true)

      const dateFridayInUK_SatInVN = new Date('2024-05-31 17:00:000Z') // new day in GMT7
      vi.setSystemTime(dateFridayInUK_SatInVN)
      expect(target.isInWorkingDays()).toBe(false)
    })
  })
})

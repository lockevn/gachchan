import { test, assert, expect, it, describe, beforeAll, afterAll, vi } from 'vitest'

import { CommonHelper } from './CommonHelper'
const target = CommonHelper

describe('CommonHelper', () => {
  describe('ToNumber', () => {
    test('Nothing should be 0', () => {
      // not a actual number, should be 0
      expect(target.toNumber('')).toBe(0)
      expect(target.toNumber('\t')).toBe(0)
      expect(target.toNumber('\r')).toBe(0)
      expect(target.toNumber('\n')).toBe(0)
      expect(target.toNumber('\r\n')).toBe(0)
      expect(target.toNumber(NaN)).toBe(0)
      expect(target.toNumber(null as unknown as string)).toBe(0)
      expect(target.toNumber(undefined as unknown as string)).toBe(0)
    })

    expect(target.toNumber('1100')).toBe(1100)
    expect(target.toNumber('-1100')).toBe(-1100)
    expect(target.toNumber(-1)).toBe(-1)
    expect(target.toNumber(-1.1)).toBe(-1.1)

    expect(target.toNumber('ATC')).toBe(0)
    expect(target.toNumber('0')).toBe(0)
    expect(target.toNumber(0)).toBe(0)

    expect(target.toNumber(19.103857566765578635)).toBe(19.1)
    expect(target.toNumber(19.103857566765578635, 0)).toBe(19)
    expect(target.toNumber('19.103857566765578635', 2)).toBe(19.1)
    expect(target.toNumber('19.106', 2)).toBe(19.11)
  })

  describe('RoundNumber', () => {
    test('RoundNumber default', () => {
      expect(target.roundNumber(19.103857566765578635)).toBe(19.1)
      expect(target.roundNumber(19.143857566765578635)).toBe(19.1)
      expect(target.roundNumber(19.144857566765578635)).toBe(19.1)
      expect(target.roundNumber(19.144857566765578635, 2)).toBe(19.14)
    })
  })

  it('HasAnyOfIntersection', () => {
    expect(target.hasAnyOfIntersection([], [])).toBe(false)
    expect(target.hasAnyOfIntersection(undefined as unknown as string, undefined)).toBe(false)
    expect(target.hasAnyOfIntersection(null as unknown as string, null as unknown as string)).toBe(false)
    expect(target.hasAnyOfIntersection(null as unknown as string)).toBe(false)

    expect(
      target.hasAnyOfIntersection([undefined as unknown as string, undefined as unknown as string, null as unknown as string, null as unknown as string, 3], [undefined as unknown as string])
    ).toBe(true)
    expect(target.hasAnyOfIntersection([undefined as unknown as string, undefined as unknown as string, null as unknown as string, null as unknown as string, 3], [null as unknown as string])).toBe(
      true
    )
    expect(target.hasAnyOfIntersection([undefined as unknown as string, undefined as unknown as string, 3], [null as unknown as string])).toBe(false)
    expect(target.hasAnyOfIntersection([undefined as unknown as string, undefined as unknown as string, 3], [4])).toBe(false)

    expect(target.hasAnyOfIntersection([1, 2, 3], 4)).toBe(false)
    expect(target.hasAnyOfIntersection([1, 2, 3], [4])).toBe(false)

    expect(target.hasAnyOfIntersection([1, 2, 3], 1)).toBe(true)
    expect(target.hasAnyOfIntersection([1, 2, 3], [1])).toBe(true)

    expect(target.hasAnyOfIntersection([1, 2, 3], [3, 4])).toBe(true)

    expect(target.hasAnyOfIntersection(['GOOD', 'PERFECT'], ['POTENTIAL', 'GOOD'])).toBe(true)

    // auto flatten
    expect(target.hasAnyOfIntersection('PERFECT', ['potential', 'good', 'perfect'])).toBe(true)
    expect(target.hasAnyOfIntersection(['potential', 'good', 'perfect'], 'PERFECT')).toBe(true)

    // ignore casing when compare
    expect(target.hasAnyOfIntersection([1, 2, 3, 'GOOD', 'PERFECT'], ['potential', 'good'])).toBe(true)
    expect(target.hasAnyOfIntersection([1, 2, 3, 'GOOD', 'PERFECT'], ['potential', 'good'], false)).toBe(false)
  })

  it('Percent', () => {
    expect(target.percent(25, 50)).toBe(50)
    expect(target.percent(25, 25)).toBe(100)
    expect(target.percent(2, 3, 2)).toBe(66.67)
  })

  it('DiffInPercent', () => {
    expect(target.diffInPercent(null as unknown as number, 90)).toBe(null)
    expect(target.diffInPercent('ATC' as unknown as number, 90)).toBe(null)
    expect(target.diffInPercent(10, 'ATC' as unknown as number)).toBe(null)

    expect(target.diffInPercent(NaN, 10)).toBe(null)

    expect(target.diffInPercent(100, 110)).toBe(10)
    expect(target.diffInPercent(100, 90)).toBe(-10)
  })

  it('ToNumberString', () => {
    expect(target.toNumberString(22.2222, 2, true, false, '%')).toBe('+22.22%')
    expect(target.toNumberString(22.2222, 2, false, false, '%')).toBe('22.22%')
    expect(target.toNumberString(-22.2222, 2, false, false, '%')).toBe('-22.22%')
    expect(target.toNumberString(0, 2, true, false, '%')).toBe('')
    expect(target.toNumberString(0, 2, true, true, '%')).toBe('0%')
    expect(target.toNumberString(0, 1)).toBe('0')

    expect(target.toNumberString(NaN, 2)).toBe('')
    expect(target.toNumberString(null as unknown as string, 2)).toBe('')
    expect(target.toNumberString(undefined, 2)).toBe('')
  })

  it('NumberToUnitString', () => {
    expect(target.numberToUnitString(10000, 1000, 0, 'k')).toBe('10k')

    expect(target.numberToUnitString(0, 1)).toBe('0')
    expect(target.numberToUnitString(NaN, 1)).toBe('')
    expect(target.numberToUnitString('', 1)).toBe('')
    expect(target.numberToUnitString('ATC', 1)).toBe('ATC')

    expect(target.numberToUnitString(100, 1, 2)).toBe('100')
    expect(target.numberToUnitString(100.1321, 1, 2)).toBe('100.13')

    expect(target.numberToUnitString(40000000, 1, 0, '', 'vi-VN')).toBe('40.000.000')
    expect(target.numberToUnitString(4000, 1, 0, '%', 'vi-VN')).toBe('4.000%')
  })

  it('JoinPaths', () => {
    expect(target.joinPaths()).toBe('')
    expect(target.joinPaths(1, 2, 3)).toBe('1/2/3')
    expect(target.joinPaths(1, null, 2, undefined, '', 3)).toBe('1/2/3')
    expect(target.joinPaths('/1/', '/2/', 3)).toBe('/1/2/3')
    expect(target.joinPaths('/1/', '', null, '/2/', undefined, null, 3)).toBe('/1/2/3')
  })

  describe('RandomOutput', () => {
    beforeAll(() => {
      // https://stackoverflow.com/questions/41570273/how-to-test-a-function-that-output-is-random-using-jest
      vi.spyOn(global.Math, 'random').mockReturnValue(0.56)
    })
    afterAll(() => {
      vi.spyOn(global.Math, 'random').mockRestore()
    })

    it('GetRandomIntegerTo', () => {
      expect(target.getRandomIntegerTo(10)).toBe(6)
      expect(target.getRandomIntegerWithin(0, 10)).toBe(6)

      expect(target.getRandomIntegerWithin(2, 10)).toBe(7)

      expect(target.getRandomIntegerWithin(11, 19)).toBeLessThan(20)
      expect(target.getRandomIntegerWithin(11, 19)).toBeGreaterThan(10)
    })

    it('GetRandomArrayElement', () => {
      expect(target.getRandomArrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(6)
    })
  })

  describe('RandomArray', () => {
    it('ShuffleArray', () => {
      const SHUFFLE_COUNT = 1000

      const array = Array.from({ length: SHUFFLE_COUNT }, (e, i) => i)
      const arrIterationResult = []

      for (let index = 0; index < SHUFFLE_COUNT; index++) {
        const newShuffleArray = target.shuffleArray(array)
        arrIterationResult.push(newShuffleArray.join('_'))
      }

      // https://stackoverflow.com/questions/840781/get-all-non-unique-values-i-e-duplicate-more-than-one-occurrence-in-an-array
      const findDuplicates = (arr: string[]) => {
        let cloned_sorted_arr = arr.slice().sort() // You can define the comparing function here.
        // JS by default uses a crappy string compare.
        // (we use slice to clone the array so the original array won't be modified)
        let results = []
        for (let i = 0; i < cloned_sorted_arr.length - 1; i++) {
          if (cloned_sorted_arr[i + 1] == cloned_sorted_arr[i]) {
            results.push(cloned_sorted_arr[i])
          }
        }
        return results
      }

      const percentageOfDuplicatedEntry = findDuplicates(arrIterationResult).length / SHUFFLE_COUNT
      expect(percentageOfDuplicatedEntry < 0.03).toBe(true)
      // console.debug("findDuplicates(ret).length / SHUFFLE_COUNT = ", findDuplicates(arrIterationResult).length, "/", SHUFFLE_COUNT, "=", percentageOfDuplicatedEntry)
    })
  })

  //
  describe('camelToSnakeCase', () => {
    it('should be convert to snake', () => {
      expect(target.camelToSnakeCase('someHereIsGood')).toBe('some_here_is_good')
      expect(target.camelToSnakeCase('OneTwoThree')).toBe('one_two_three')
      expect(target.camelToSnakeCase('anotherExample')).toBe('another_example')
      expect(target.camelToSnakeCase('CAPITALIZED')).toBe('c_a_p_i_t_a_l_i_z_e_d')
    })
  })

  describe('objectMapKeys', () => {
    it('should be mapped, and remove non-mapped keys', () => {
      const actual = target.objectMapKeys(
        {
          a: 1,
          b: 2,
          c: 3,
        },
        {
          a: 'AA',
          b: 'BB',
        }
      )

      expect(actual).toMatchObject({
        AA: 1,
        BB: 2,
      })
    })
  })

  describe('toCamelCase', () => {
    it('converts basic snake_case to camelCase', () => {
      expect(target.toCamelCase('some_case_here')).toEqual('someCaseHere')
      expect(target.toCamelCase('hello_world')).toBe('helloWorld')
    })

    it('handles single words', () => {
      expect(target.toCamelCase('hello')).toBe('hello')
    })
    it('handles empty string', () => {
      expect(target.toCamelCase('')).toBe('')
    })
    it('handles string with leading underscore', () => {
      expect(target.toCamelCase('_hello_world')).toBe('helloWorld')
    })
  })

  describe('convertKeysToCamelCase', () => {
    it('array should be good', async () => {
      expect(target.convertKeysToCamelCase([{ some_case_here: 1 }]))
        //
        .toMatchObject([{ someCaseHere: 1 }])
    })

    it('object keys should be good', async () => {
      expect(target.convertKeysToCamelCase({ some_case_here: 1 }))
        //
        .toMatchObject({ someCaseHere: 1 })
    })

    it('preserves primitive values', () => {
      const input = {
        string_value: 'test',
        number_value: 123,
        boolean_value: true,
        null_value: null,
      }
      const expected = {
        stringValue: 'test',
        numberValue: 123,
        booleanValue: true,
        nullValue: null,
      }
      expect(target.convertKeysToCamelCase(input)).toEqual(expected)
    })

    it('handles nested objects', () => {
      const input = {
        user_info: {
          first_name: 'John',
          contact_details: {
            phone_number: '123',
          },
        },
      }
      const expected = {
        userInfo: {
          firstName: 'John',
          contactDetails: {
            phoneNumber: '123',
          },
        },
      }
      expect(target.convertKeysToCamelCase(input)).toEqual(expected)
    })

    it('handles null and undefined', () => {
      expect(target.convertKeysToCamelCase(null as unknown as object)).toBe(null)
      expect(target.convertKeysToCamelCase(undefined as unknown as object)).toBe(undefined)
    })

    it('handles empty object and array', () => {
      expect(target.convertKeysToCamelCase({})).toEqual({})
      expect(target.convertKeysToCamelCase([])).toEqual([])
    })

    it('handles mixed content', () => {
      const input = {
        user_data: [{ first_name: 'John' }, { contact_info: { phone_number: '123' } }],
        simple_key: 'value',
      }
      const expected = {
        userData: [{ firstName: 'John' }, { contactInfo: { phoneNumber: '123' } }],
        simpleKey: 'value',
      }
      expect(target.convertKeysToCamelCase(input)).toEqual(expected)
    })
  })
  //
})

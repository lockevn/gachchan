import { test, expect, it, describe } from 'vitest'
import { UtilHelper } from './UtilHelper'
const target = UtilHelper

describe('Util', () => {
  describe('GetRandomNumberBetween(10, 20)', () => {
    it('GetRandomNumberBetween(10, 20)', () => {
      expect(target.GetRandomNumberBetween(11, 19)).toBeLessThan(20)
      expect(target.GetRandomNumberBetween(11, 19)).toBeGreaterThan(10)
    })
  })

  describe('splitByCommaAndTrim()', () => {
    it('1,2,3 ,,, 4, 5 ,6 should be [1,2,3,4,5,6]', () => {
      let actual = target.splitByCommaAndTrim('1,2,3 ,,, 4, 5 ,6')

      expect(actual.length).toBe(6)
      expect(actual[0]).toBe('1')
      expect(actual[5]).toBe('6')
    })
  })

  describe('mergeAndDistinct', () => {
    it('123 and 453 should be 12345', () => {
      let actual = target.mergeAndDistinct([1, 2, 3], [4, 5, 3])
      expect(actual.indexOf(4) >= 0).toBeTruthy()
      expect(actual.indexOf(5) >= 0).toBeTruthy()
    })
  })

  describe('parseJsonDate', () => {
    it("/Date(2342353453434)/ should be 'Wed Mar 23 2044 20:44:13 GMT+0700 (Indochina Time)'", () => {
      let actual = target.parseJsonDate('/Date(2342353453434)/')

      expect(actual.getUTCFullYear() === 2044).toBeTruthy()
      expect(actual.getUTCMonth() === 2).toBeTruthy() // from 0
      expect(actual.getUTCDate() === 23).toBeTruthy()
    })
  })

  describe('joinPath', () => {
    test('join a and b should be a/b', () => {
      expect(target.joinPath('a', 'b')).toBe('a/b')
      expect(target.joinPath('a/', 'b')).toBe('a/b')
      expect(target.joinPath('a', '/b')).toBe('a/b')
      expect(target.joinPath('/a/', '/b')).toBe('/a/b')
    })

    test('join /a and b should be /a/b', () => {
      expect(target.joinPath('/a/', '/b')).toBe('/a/b')
    })
  })

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
      expect(target.convertKeysToCamelCase(null)).toBe(null)
      expect(target.convertKeysToCamelCase(undefined)).toBe(undefined)
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
})

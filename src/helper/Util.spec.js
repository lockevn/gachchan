import { Util } from "../../dist"
const target = Util

describe("Util", () => {
  describe("GetRandomNumberBetween(10, 20)", () => {
    it("GetRandomNumberBetween(10, 20)", () => {
      expect(target.GetRandomNumberBetween(11, 19)).toBeLessThan(20)
      expect(target.GetRandomNumberBetween(11, 19)).toBeGreaterThan(10)
    })
  })

  describe("splitByCommaAndTrim()", () => {
    it("1,2,3 ,,, 4, 5 ,6 should be [1,2,3,4,5,6]", () => {
      let actual = target.splitByCommaAndTrim("1,2,3 ,,, 4, 5 ,6")

      expect(actual.length).toBe(6)
      expect(actual[0]).toBe("1")
      expect(actual[5]).toBe("6")
    })
  })

  describe("mergeAndDistinct", () => {
    it("123 and 453 should be 12345", () => {
      let actual = target.mergeAndDistinct([1, 2, 3], [4, 5, 3])
      expect(actual.indexOf(4) >= 0).toBeTruthy()
      expect(actual.indexOf(5) >= 0).toBeTruthy()
    })
  })

  describe("parseJsonDate", () => {
    it("/Date(2342353453434)/ should be 'Wed Mar 23 2044 20:44:13 GMT+0700 (Indochina Time)'", () => {
      let actual = target.parseJsonDate("/Date(2342353453434)/")

      expect(actual.getUTCFullYear() === 2044).toBeTruthy()
      expect(actual.getUTCMonth() === 2).toBeTruthy() // from 0
      expect(actual.getUTCDate() === 23).toBeTruthy()
    })
  })

  describe("joinPath", () => {
    test("join a and b should be a/b", () => {
      expect(target.joinPath("a", "b")).toBe("a/b")
      expect(target.joinPath("a/", "b")).toBe("a/b")
      expect(target.joinPath("a", "/b")).toBe("a/b")
      expect(target.joinPath("/a/", "/b")).toBe("/a/b")
    })

    test("join /a and b should be /a/b", () => {
      expect(target.joinPath("/a/", "/b")).toBe("/a/b")
    })
  })
})

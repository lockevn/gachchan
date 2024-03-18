import { CommonHelper } from "../../dist"
const target = CommonHelper

describe("CommonHelper", () => {
  describe("ToNumber", () => {
    it("Nothing should be 0", () => {
      // not a actual number, should be 0
      expect(target.ToNumber("")).toBe(0)
      expect(target.ToNumber("\t")).toBe(0)
      expect(target.ToNumber("\r")).toBe(0)
      expect(target.ToNumber("\n")).toBe(0)
      expect(target.ToNumber("\r\n")).toBe(0)
      expect(target.ToNumber(NaN)).toBe(0)
      expect(target.ToNumber(null)).toBe(0)
      expect(target.ToNumber(undefined)).toBe(0)
    })

    expect(target.ToNumber("1100")).toBe(1100)
    expect(target.ToNumber("-1100")).toBe(-1100)
    expect(target.ToNumber(-1)).toBe(-1)
    expect(target.ToNumber(-1.1)).toBe(-1.1)

    expect(target.ToNumber("ATC")).toBe(0)
    expect(target.ToNumber("0")).toBe(0)
    expect(target.ToNumber(0)).toBe(0)

    expect(target.ToNumber(19.103857566765578635)).toBe(19.103857566765578635)
    expect(target.ToNumber(19.103857566765578635, 0)).toBe(19)
    expect(target.ToNumber("19.103857566765578635", 2)).toBe(19.1)
    expect(target.ToNumber("19.106", 2)).toBe(19.11)
  })

  describe("ToNumber", () => {
    expect(target.RoundNumber(19.103857566765578635)).toBe(19.1)
    expect(target.RoundNumber(19.143857566765578635)).toBe(19.1)
    expect(target.RoundNumber(19.144857566765578635)).toBe(19.1)
    expect(target.RoundNumber(19.144857566765578635, 2)).toBe(19.14)
  })

  it("HasAnyOfIntersection", () => {
    expect(target.HasAnyOfIntersection([], [])).toBe(false)
    expect(target.HasAnyOfIntersection(undefined, undefined)).toBe(false)
    expect(target.HasAnyOfIntersection(null, null)).toBe(false)
    expect(target.HasAnyOfIntersection(null)).toBe(false)

    expect(target.HasAnyOfIntersection([undefined, undefined, null, null, 3], [undefined])).toBe(true)
    expect(target.HasAnyOfIntersection([undefined, undefined, null, null, 3], [null])).toBe(true)
    expect(target.HasAnyOfIntersection([undefined, undefined, 3], [null])).toBe(false)
    expect(target.HasAnyOfIntersection([undefined, undefined, 3], [4])).toBe(false)

    expect(target.HasAnyOfIntersection([1, 2, 3], 4)).toBe(false)
    expect(target.HasAnyOfIntersection([1, 2, 3], [4])).toBe(false)

    expect(target.HasAnyOfIntersection([1, 2, 3], 1)).toBe(true)
    expect(target.HasAnyOfIntersection([1, 2, 3], [1])).toBe(true)

    expect(target.HasAnyOfIntersection([1, 2, 3], [3, 4])).toBe(true)

    expect(target.HasAnyOfIntersection(["GOOD", "PERFECT"], ["POTENTIAL", "GOOD"])).toBe(true)

    // auto flatten
    expect(target.HasAnyOfIntersection("PERFECT", ["potential", "good", "perfect"])).toBe(true)
    expect(target.HasAnyOfIntersection(["potential", "good", "perfect"], "PERFECT")).toBe(true)

    // ignore casing when compare
    expect(target.HasAnyOfIntersection([1, 2, 3, "GOOD", "PERFECT"], ["potential", "good"])).toBe(true)
    expect(target.HasAnyOfIntersection([1, 2, 3, "GOOD", "PERFECT"], ["potential", "good"], false)).toBe(false)
  })

  it("Percent", () => {
    expect(target.Percent(25, 50)).toBe(50)
    expect(target.Percent(25, 25)).toBe(100)
    expect(target.Percent(2, 3, 2)).toBe(66.67)
  })

  it("DiffInPercent", () => {
    expect(target.DiffInPercent(null, 90)).toBe(null)
    expect(target.DiffInPercent("ATC", 90)).toBe(null)
    expect(target.DiffInPercent(10, "ATC")).toBe(null)

    expect(target.DiffInPercent(NaN, 10)).toBe(NaN)

    expect(target.DiffInPercent(100, 110)).toBe(10)
    expect(target.DiffInPercent(100, 90)).toBe(-10)
  })

  it("ToNumberString", () => {
    expect(target.ToNumberString(22.2222, 2, true, false, "%")).toBe("+22.22%")
    expect(target.ToNumberString(22.2222, 2, false, false, "%")).toBe("22.22%")
    expect(target.ToNumberString(-22.2222, 2, false, false, "%")).toBe("-22.22%")
    expect(target.ToNumberString(0, 2, true, false, "%")).toBe("")
    expect(target.ToNumberString(0, 2, true, true, "%")).toBe("0%")
    expect(target.ToNumberString(0, 1)).toBe("0")

    expect(target.ToNumberString(NaN, 2)).toBe("")
    expect(target.ToNumberString(null, 2)).toBe("")
    expect(target.ToNumberString(undefined, 2)).toBe("")
  })

  it("RepresentNumberInIconicDigit", () => {
    expect(target.RepresentNumberInIconicDigit(undefined)).toBe("")
    expect(target.RepresentNumberInIconicDigit(null)).toBe("")
    expect(target.RepresentNumberInIconicDigit("")).toBe("")
    expect(target.RepresentNumberInIconicDigit("000123456789")).toBe("0️⃣0️⃣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣")
  })

  describe("Mocking date times", () => {
    beforeAll(() => {
      // https://stackoverflow.com/questions/28504545/how-to-mock-a-constructor-like-new-date/65548068#65548068
      jest.useFakeTimers("modern")
      jest.setSystemTime(new Date("2020-01-01 07:00:00"))
    })
    afterAll(() => {
      jest.useRealTimers()
    })

    it("GetCurrentYearMonthDayString", () => {
      expect(target.GetCurrentYearMonthDayString(new Date("2000-12-31 10:01:59"))).toBe("20001231")
    })

    it("GetCurrentHoursMinutesString", () => {
      expect(target.GetCurrentHoursMinutesString(new Date("2000-01-01 10:01:59"))).toBe("1001")
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
  })

  it("NumberToUnitString", () => {
    expect(target.NumberToUnitString(10000, 1000, 0, "k")).toBe("10k")

    expect(target.NumberToUnitString(0, 1)).toBe("0")
    expect(target.NumberToUnitString(NaN, 1)).toBe("")
    expect(target.NumberToUnitString("", 1)).toBe("")
    expect(target.NumberToUnitString("ATC", 1)).toBe("ATC")

    expect(target.NumberToUnitString(100, 1, 2)).toBe("100")
    expect(target.NumberToUnitString(100.1321, 1, 2)).toBe("100.13")

    expect(target.NumberToUnitString(40000000, 1, 0, "", "vi-VN")).toBe("40.000.000")
    expect(target.NumberToUnitString(4000, 1, 0, "%", "vi-VN")).toBe("4.000%")
  })

  it("JoinPaths", () => {
    expect(target.JoinPaths()).toBe("")
    expect(target.JoinPaths(1, 2, 3)).toBe("1/2/3")
    expect(target.JoinPaths(1, null, 2, undefined, "", 3)).toBe("1/2/3")
    expect(target.JoinPaths("/1/", "/2/", 3)).toBe("/1/2/3")
    expect(target.JoinPaths("/1/", "", null, "/2/", undefined, null, 3)).toBe("/1/2/3")
  })

  describe("RandomOutput", () => {
    beforeAll(() => {
      // https://stackoverflow.com/questions/41570273/how-to-test-a-function-that-output-is-random-using-jest
      jest.spyOn(global.Math, "random").mockReturnValue(0.56)
    })
    afterAll(() => {
      jest.spyOn(global.Math, "random").mockRestore()
    })

    it("GetRandomIntegerTo", () => {
      expect(target.GetRandomIntegerTo(10)).toBe(6)
    })
    it("GetRandomArrayElement", () => {
      expect(target.GetRandomArrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(6)
    })
  })

  describe("RandomArray", () => {
    it("ShuffleArray", () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      const ret = []

      const shuffleCount = 1000

      for (let index = 0; index < shuffleCount; index++) {
        target.ShuffleArray(array)
        ret.push(array.join("_"))
      }

      // https://stackoverflow.com/questions/840781/get-all-non-unique-values-i-e-duplicate-more-than-one-occurrence-in-an-array
      const findDuplicates = arr => {
        let sorted_arr = arr.slice().sort() // You can define the comparing function here.
        // JS by default uses a crappy string compare.
        // (we use slice to clone the array so the
        // original array won't be modified)
        let results = []
        for (let i = 0; i < sorted_arr.length - 1; i++) {
          if (sorted_arr[i + 1] == sorted_arr[i]) {
            results.push(sorted_arr[i])
          }
        }
        return results
      }

      const percentageOfDup = findDuplicates(ret).length / shuffleCount
      console.log("percentageOfDup", percentageOfDup)

      expect(percentageOfDup > 0.05).toBe(false)
    })
  })

  //
  //
})

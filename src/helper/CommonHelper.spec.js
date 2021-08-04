import { CommonHelper } from "../../dist"

describe("CommonHelper", () => {
  beforeAll(async () => {})

  it("ToActualNumber", () => {
    expect(CommonHelper.ToActualNumber("1100")).toBe(1100)
    expect(CommonHelper.ToActualNumber("-1100")).toBe(-1100)
    expect(CommonHelper.ToActualNumber(-1)).toBe(-1)
    expect(CommonHelper.ToActualNumber(-1.1)).toBe(-1.1)

    // not a actual number, should be 0
    expect(CommonHelper.ToActualNumber("")).toBe(0)
    expect(CommonHelper.ToActualNumber("ATC")).toBe(0)
    expect(CommonHelper.ToActualNumber("0")).toBe(0)
    expect(CommonHelper.ToActualNumber(0)).toBe(0)
    expect(CommonHelper.ToActualNumber(NaN)).toBe(0)
    expect(CommonHelper.ToActualNumber(undefined)).toBe(0)
    expect(CommonHelper.ToActualNumber(null)).toBe(0)
  })

  it("FormatNumber", () => {
    expect(CommonHelper.FormatNumber(19.103857566765578635)).toBe(19)
    expect(CommonHelper.FormatNumber("19.103857566765578635")).toBe(19)
    expect(CommonHelper.FormatNumber("19.103857566765578635", 2)).toBe(19.1)
  })

  it("StandardizeVolNumber", () => {
    expect(CommonHelper.StandardizeVolNumber("")).toBe("")

    expect(CommonHelper.StandardizeVolNumber("0")).toBe(0)
    expect(CommonHelper.StandardizeVolNumber(0)).toBe(0)

    expect(CommonHelper.StandardizeVolNumber("1000")).toBe(1000)
    expect(CommonHelper.StandardizeVolNumber("1,000")).toBe(1000)
    expect(CommonHelper.StandardizeVolNumber("1,000,000.11")).toBe(1000000.11)

    expect(CommonHelper.StandardizeVolNumber(1000)).toBe(1000)
    expect(CommonHelper.StandardizeVolNumber(1000.11)).toBe(1000.11)
  })

  it("HasAnyOfIntersection", () => {
    expect(CommonHelper.HasAnyOfIntersection([], [])).toBe(false)
    expect(CommonHelper.HasAnyOfIntersection(undefined, undefined)).toBe(false)
    expect(CommonHelper.HasAnyOfIntersection(null, null)).toBe(false)
    expect(CommonHelper.HasAnyOfIntersection(null)).toBe(false)

    expect(CommonHelper.HasAnyOfIntersection([1, 2, 3], 4)).toBe(false)
    expect(CommonHelper.HasAnyOfIntersection([1, 2, 3], [4])).toBe(false)

    expect(CommonHelper.HasAnyOfIntersection([1, 2, 3], 1)).toBe(true)
    expect(CommonHelper.HasAnyOfIntersection([1, 2, 3], [1])).toBe(true)

    expect(CommonHelper.HasAnyOfIntersection([1, 2, 3], [3, 4])).toBe(true)

    expect(CommonHelper.HasAnyOfIntersection(["GOOD", "PERFECT"], ["POTENTIAL", "GOOD"])).toBe(true)

    // auto flatten
    expect(CommonHelper.HasAnyOfIntersection("PERFECT", ["potential", "good", "perfect"])).toBe(true)
    expect(CommonHelper.HasAnyOfIntersection(["potential", "good", "perfect"], "PERFECT")).toBe(true)

    // ignore casing when compare
    expect(CommonHelper.HasAnyOfIntersection([1, 2, 3, "GOOD", "PERFECT"], ["potential", "good"])).toBe(true)
    expect(CommonHelper.HasAnyOfIntersection([1, 2, 3, "GOOD", "PERFECT"], ["potential", "good"], false)).toBe(false)
  })

  it("Percent", () => {
    expect(CommonHelper.Percent(25, 50)).toBe(50)
    expect(CommonHelper.Percent(25, 25)).toBe(100)
    expect(CommonHelper.Percent(2, 3, 2)).toBe(66.67)
  })

  it("DiffInPercent", () => {
    expect(CommonHelper.DiffInPercent(null, 90)).toBe(null)
    expect(CommonHelper.DiffInPercent("ATC", 90)).toBe(null)
    expect(CommonHelper.DiffInPercent(10, "ATC")).toBe(null)

    expect(CommonHelper.DiffInPercent(NaN, 10)).toBe(NaN)

    expect(CommonHelper.DiffInPercent(100, 110)).toBe(10)
    expect(CommonHelper.DiffInPercent(100, 90)).toBe(-10)
  })

  it("ToNumberString", () => {
    expect(CommonHelper.ToNumberString(22.2222, 2, true, false, "%")).toBe("+22.22%")
    expect(CommonHelper.ToNumberString(22.2222, 2, false, false, "%")).toBe("22.22%")
    expect(CommonHelper.ToNumberString(-22.2222, 2, false, false, "%")).toBe("-22.22%")
    expect(CommonHelper.ToNumberString(0, 2, true, false, "%")).toBe("")
    expect(CommonHelper.ToNumberString(0, 2, true, true, "%")).toBe("0%")

    expect(CommonHelper.ToNumberString(NaN, 2)).toBe("")
    expect(CommonHelper.ToNumberString(null, 2)).toBe("")
    expect(CommonHelper.ToNumberString(undefined, 2)).toBe("")
  })

  it("RepresentNumberInIconicDigit", () => {
    expect(CommonHelper.RepresentNumberInIconicDigit(undefined)).toBe("")
    expect(CommonHelper.RepresentNumberInIconicDigit(null)).toBe("")
    expect(CommonHelper.RepresentNumberInIconicDigit("")).toBe("")
    expect(CommonHelper.RepresentNumberInIconicDigit("1")).toBe("1️⃣")
    expect(CommonHelper.RepresentNumberInIconicDigit("0123456789")).toBe("0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣")
  })

  it("GetCurrentHoursMinutesString", () => {
    expect(CommonHelper.GetCurrentHoursMinutesString(new Date(2000, 1, 1, 1, 1, 59))).toBe("0101")
  })
  it("GetCurrentHoursMinutesSecondsString", () => {
    expect(CommonHelper.GetCurrentHoursMinutesSecondsString(new Date(2017, 4, 10))).toBe("000000")
    expect(CommonHelper.GetCurrentHoursMinutesSecondsString(new Date(2017, 4, 10, 11, 59, 59))).toBe("115959")
  })

  it("IsInWorkingHours", () => {
    expect(CommonHelper.IsInWorkingHours("0845")).toBe(true)
    expect(CommonHelper.IsInWorkingHours("0914")).toBe(true)
    expect(CommonHelper.IsInWorkingHours("1130")).toBe(true)

    expect(CommonHelper.IsInWorkingHours("1131")).toBe(false)
    expect(CommonHelper.IsInWorkingHours("1259")).toBe(false)

    expect(CommonHelper.IsInWorkingHours("1300")).toBe(true)
    expect(CommonHelper.IsInWorkingHours("1445")).toBe(true)

    expect(CommonHelper.IsInWorkingHours("1446")).toBe(false)
  })

  it("IsIn_ATO_Sessions", () => {
    expect(CommonHelper.IsIn_ATO_Sessions("0900")).toBe(true)
    expect(CommonHelper.IsIn_ATO_Sessions("0914")).toBe(true)

    expect(CommonHelper.IsIn_ATO_Sessions("1100")).toBe(false)
  })

  it("IsIn_ATC_Sessions", () => {
    expect(CommonHelper.IsIn_ATC_Sessions("1430")).toBe(true)
    expect(CommonHelper.IsIn_ATC_Sessions("1445")).toBe(true)

    expect(CommonHelper.IsIn_ATC_Sessions("1446")).toBe(false)
  })

  it("IsInWorkingDays", () => {
    expect(CommonHelper.IsInWorkingDays(new Date(2021, 6, 31))).toBe(false) // last sat of July
    expect(CommonHelper.IsInWorkingDays(new Date(2021, 7, 1))).toBe(false) // first sunday of August
    expect(CommonHelper.IsInWorkingDays(new Date(2021, 7, 2))).toBe(true) // monday
  })

  it("NumberToUnitString", () => {
    expect(CommonHelper.NumberToUnitString(10000, 1000, 0, "k")).toBe("10k")
  })

  it("JoinPaths", () => {
    expect(CommonHelper.JoinPaths()).toBe("")
    expect(CommonHelper.JoinPaths(1, 2, 3)).toBe("1/2/3")
    expect(CommonHelper.JoinPaths("/1/", "/2/", 3)).toBe("/1/2/3")
  })

  it("GetRandomArrayElement", () => {
    // expect(CommonHelper.GetRandomArrayElement()).toBe("")
  })
})

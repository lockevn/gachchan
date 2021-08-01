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

  it("RepresentNumberInIconicDigit", () => {
    expect(CommonHelper.RepresentNumberInIconicDigit(undefined)).toBe("")
    expect(CommonHelper.RepresentNumberInIconicDigit(null)).toBe("")
    expect(CommonHelper.RepresentNumberInIconicDigit("")).toBe("")
    expect(CommonHelper.RepresentNumberInIconicDigit("1")).toBe("1️⃣")
    expect(CommonHelper.RepresentNumberInIconicDigit("0123456789")).toBe("0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣")
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

  it("GetCurrentHoursMinutesSecondsString", () => {
    expect(CommonHelper.GetCurrentHoursMinutesSecondsString(new Date(2017, 4, 10))).toBe("000000")
    expect(CommonHelper.GetCurrentHoursMinutesSecondsString(new Date(2017, 4, 10, 11, 59, 59))).toBe("115959")
  })

  it("IsIn_ATO_Sessions", () => {
    expect(CommonHelper.IsIn_ATO_Sessions("0900")).toBe(true)
    expect(CommonHelper.IsIn_ATO_Sessions("0914")).toBe(true)

    expect(CommonHelper.IsIn_ATO_Sessions("1100")).toBe(false)
  })

  it("IsIn_ATC_Sessions", () => {
    expect(CommonHelper.IsIn_ATC_Sessions("1100")).toBe(false)

    expect(CommonHelper.IsIn_ATC_Sessions("1430")).toBe(true)
    expect(CommonHelper.IsIn_ATC_Sessions("1445")).toBe(true)
  })
})

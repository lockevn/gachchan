import { StockHelper } from "../../dist"
const target = StockHelper

describe("StockHelper", () => {
  beforeAll(async () => {})

  it("StandardizeVolNumber", () => {
    expect(target.StandardizeVolNumber("")).toBe("")

    expect(target.StandardizeVolNumber("0")).toBe(0)
    expect(target.StandardizeVolNumber(0)).toBe(0)

    expect(target.StandardizeVolNumber("1000")).toBe(1000)
    expect(target.StandardizeVolNumber("1,000")).toBe(1000)
    expect(target.StandardizeVolNumber("1,000,000.11")).toBe(1000000.11)

    expect(target.StandardizeVolNumber(1000)).toBe(1000)
    expect(target.StandardizeVolNumber(1000.11)).toBe(1000.11)
  })

  describe("Mocking times", () => {
    it("IsInWorkingHours", () => {
      expect(target.IsInWorkingHours("0845")).toBe(true)
      expect(target.IsInWorkingHours("0914")).toBe(true)
      expect(target.IsInWorkingHours("1130")).toBe(true)

      expect(target.IsInWorkingHours("1131")).toBe(false)
      expect(target.IsInWorkingHours("1259")).toBe(false)

      expect(target.IsInWorkingHours("1300")).toBe(true)
      expect(target.IsInWorkingHours("1445")).toBe(true)

      expect(target.IsInWorkingHours("1446")).toBe(false)
    })

    it("IsIn_ATO_Sessions", () => {
      expect(target.IsIn_ATO_Sessions("0900")).toBe(true)
      expect(target.IsIn_ATO_Sessions("0914")).toBe(true)

      expect(target.IsIn_ATO_Sessions("1100")).toBe(false)
    })

    it("IsIn_ATC_Sessions", () => {
      expect(target.IsIn_ATC_Sessions("1430")).toBe(true)
      expect(target.IsIn_ATC_Sessions("1445")).toBe(true)

      expect(target.IsIn_ATC_Sessions("1446")).toBe(false)
    })

    it("IsInWorkingDays", () => {
      expect(target.IsInWorkingDays(new Date("2021-07-31"))).toBe(false) // last sat of July
      expect(target.IsInWorkingDays(new Date("2021-08-01"))).toBe(false) // first sunday of August
      expect(target.IsInWorkingDays(new Date("2021-08-02"))).toBe(true) // monday
    })
  })

  // describe("generateRandomPriceData", function() {
  //   it("generateRandomPriceData", function() {
  //     // mock data, with max variation = 7%
  //     function generateRandomPriceData(_startingPrice, _limitLength) {
  //       var arrFakeData = [_startingPrice];
  //       for (var i = 1; i < _limitLength; i++) {
  //         var cur = arrFakeData[i - 1];
  //         var r =
  //           cur *
  //           (1 + ((Math.random() > 0.5 ? -1 : 1) * Math.random()) / 14.28);
  //         arrFakeData.push(xctarget.roundToTwo(r));
  //       }
  //       return arrFakeData;
  //     }

  //     var arr = generateRandomPriceData(100, 10);
  //     assert.equal(arr.length, 10);
  //     assert.equal(arr[0], 100);
  //   });
  // });
})

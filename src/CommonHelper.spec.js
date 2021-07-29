import lib from ".."

describe("CommonHelper", () => {
  beforeAll(async () => {})
  it("ToActualNumber", () => {
    expect(lib.CommonHelper.hello("1100")).toBe("Hello 1100")
  })
})

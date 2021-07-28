import CommonHelper from "./CommonHelper";

describe("CommonHelper", () => {
  beforeAll(async () => {});
  it("ToActualNumber", () => {
    expect(CommonHelper.hello("1100")).toBe("Hello 1100");
  });
});

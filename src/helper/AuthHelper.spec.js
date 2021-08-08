var { AuthHelper } = require("../../dist")
const target = AuthHelper

describe("AuthHelper", () => {
  describe("hasRoles", () => {
    it("it should return satisfied roles", () => {
      let actual = target.hasRoles("admin", ["admin"])

      expect(actual.indexOf("admin") === 0).toBeTruthy()

      actual = target.hasRoles("admin,crm,advisor", ["admin"])
      expect(actual.indexOf("admin") >= 0).toBeTruthy()
      expect(actual.indexOf("crm") >= 0).toBeTruthy()
      expect(actual.indexOf("advisor") >= 0).toBeTruthy()

      actual = target.hasRoles("admin,crm,advisor", ["crm"])
      expect(actual.indexOf("crm") === 0).toBeTruthy()

      actual = target.hasRoles("admin,crm", ["crm"])
      expect(actual.indexOf("crm") === 0).toBeTruthy()

      actual = target.hasRoles("admin,advisor", ["crm"])
      expect(actual.indexOf("crm") < 0).toBeTruthy()

      actual = target.hasRoles("sysadmin,a,b,advisor", ["crm", "advisor"])
      expect(actual.indexOf("advisor") == 0).toBeTruthy()
      expect(actual.indexOf("crm") < 0).toBeTruthy()
    })
  })
})

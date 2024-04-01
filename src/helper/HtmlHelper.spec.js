import { HtmlHelper } from "../../dist"
const target = HtmlHelper

describe("HtmlHelper", () => {
  describe("cleanupHtmlTags", () => {
    it("cleanupHtmlTags multiple occurences", () => {
      expect(target.cleanupHtmlTags("<a href='abc'>xcyx</a><a href='abc'>xcyx</a>", ["a"])).toBe("")
    })

    it("cleanupHtmlTags multiple tags with newlines", () => {
      expect(
        target
          .cleanupHtmlTags(
            `
      <a href='abc'>xcyx</a>
      <b class='myClass'>xcyx</b>
      <b class='myClass'>xcyx</b>
      <b class='myClass'>xcyx</b>
      <b class='myClass'>xcyx</b>
      myText`,
            ["a", "b"]
          )
          .trim()
      ).toBe("myText")
    })
  })
})

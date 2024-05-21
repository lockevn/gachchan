import { XAPIService } from "./XAPIService"
var svc = new XAPIService("http://xcap.ddns.net:28100/graphql", "", "", "")

describe("XAPIService", () => {
  describe("query the data from GraphQL", () => {
    test(`all symbols should contains VCB HPG GMD CTD`, async () => {
      let data = await svc.Query(`
{
    symbols {Id}
}
`)
      data = data.symbols.map(r => r.Id)
      expect(data).toContain("VCB")
      expect(data).toContain("HPG")
      expect(data).toContain("CTD")
      expect(data).toContain("GMD")
    })
  })
})

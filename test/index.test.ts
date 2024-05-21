import { test, assert } from "vitest"
import { foo } from "../src"

test("simple", () => {
  assert.equal(foo, "foo")
})

// var { Util, AuthHelper, XAPIService, ReactiveSymbolHistoryStore } = require("..")

// let actual = Util.parseJsonDate("/Date(2342353453434)/")
// assert.isTrue(actual.getUTCFullYear() === 2044)
// assert.isTrue(actual.getUTCMonth() === 2) // from 0
// assert.isTrue(actual.getUTCDate() === 23)

// ;(async () => {
//   var symbolHistoryStore = new ReactiveSymbolHistoryStore()
//   symbolHistoryStore.listSymbolHistory = async function (symbolCategory, symbolId, tickPeriod = "1D", limitLength = 660) {
//     return [{ symbolId: "TEST", close: 555 }]
//   }
//   symbolHistoryStore.init()

//   await symbolHistoryStore.loadSymbolHistory("VietnamStock", "TEST")
//   console.log(symbolHistoryStore.state.TEST.pricesOHLCExtended)

//   setTimeout(async () => {
//     await symbolHistoryStore.mergeLatestPriceToStore({ TEST: { p: 111 } }, symbolHistoryStore.state)
//     console.log(symbolHistoryStore.state.TEST.pricesOHLCExtended)
//   }, 2000)
// })()

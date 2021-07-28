"use strict";

//During the test the env variable is set to test
process.env.NODE_ENV = "test";

//Require the dev-dependencies
let chai = require("chai");
let should = chai.should();
let assert = chai.assert;

var { Util, AuthHelper, XAPIService, ReactiveSymbolHistoryStore } = require("..");
var svc = new XAPIService("http://xcap.ddns.net:28100/graphql", "", "", "");

let actual = Util.parseJsonDate("/Date(2342353453434)/");
assert.isTrue(actual.getUTCFullYear() === 2044);
assert.isTrue(actual.getUTCMonth() === 2); // from 0
assert.isTrue(actual.getUTCDate() === 23);

(async () => {
  const data = await svc.Query(`
{
    symbols {Id}
}
`);
  console.log(data);

  var symbolHistoryStore = new ReactiveSymbolHistoryStore();
  symbolHistoryStore.listSymbolHistory = async function(symbolCategory, symbolId, tickPeriod = "1D", limitLength = 660) {
    return [{ symbolId: "TEST", close: 555 }];
  };
  symbolHistoryStore.init();

  await symbolHistoryStore.loadSymbolHistory("VietnamStock", "TEST");
  console.log(symbolHistoryStore.state.TEST.pricesOHLCExtended);

  setTimeout(async () => {
    await symbolHistoryStore.mergeLatestPriceToStore({ TEST: { p: 111 } }, symbolHistoryStore.state);
    console.log(symbolHistoryStore.state.TEST.pricesOHLCExtended);
  }, 2000);
})();

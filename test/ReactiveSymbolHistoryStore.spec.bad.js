//During the test the env variable is set to test
process.env.NODE_ENV = "test";

//Require the dev-dependencies
let chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var { ReactiveSymbolHistoryStore } = require("..");
var symbolHistoryStore = new ReactiveSymbolHistoryStore();
symbolHistoryStore.cacheInvalidator = function() {};
symbolHistoryStore.listSymbolHistory = async function(symbolCategory, symbolId, tickPeriod = "1D", limitLength = 660) {
  return [{ symbolId: "TEST", close: 555 }];
};
symbolHistoryStore.get_fb$VietnamStock = () => ({});
symbolHistoryStore.getLatestPrices_HTTP_Once = async function() {
  return {};
};
symbolHistoryStore.init();

describe("ReactiveSymbolHistoryStore", () => {
  test(`return {} as fb$vietnamStock`, async () => {
    let actual = symbolHistoryStore.get_fb$VietnamStock();
    expect(actual).toEqual({});
  });

  test(`return {} as getLatestPrices_HTTP_Once`, async () => {
    let actual = await symbolHistoryStore.getLatestPrices_HTTP_Once();
    expect(actual).toEqual({});
  });

  test(`mergeLatestPriceToStore`, async () => {
    let actual = await symbolHistoryStore.mergeLatestPriceToStore({ TEST: { p: 111 } }, symbolHistoryStore.state);

    setTimeout(() => {
      expect(symbolHistoryStore.state.TEST.pricesOHLCExtended.slice(-1)[0].close).toEqual(111);
    }, 2000);
  });

  test(`loadSymbolHistory`, async () => {
    let actual = await symbolHistoryStore.loadSymbolHistory("VietnamStock", "TEST");

    setTimeout(() => {
      expect(symbolHistoryStore.state.TEST.pricesOHLCExtended.slice(-1)[0].close).toEqual(555);
    }, 2000);
  });
});

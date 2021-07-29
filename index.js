// "use strict";

var Util = require("./src/lib/Util")
var AuthHelper = require("./src/lib/AuthHelper")
var ReactiveSymbolHistoryStore = require("./src/lib/ReactiveSymbolHistoryStore")
var XAPIService = require("./src/services/XAPIService")

console.log("lib index import CommonHelper")
import CommonHelper from "./src/CommonHelper"

// Exports
module.exports.Util = Util
module.exports.AuthHelper = AuthHelper
module.exports.ReactiveSymbolHistoryStore = ReactiveSymbolHistoryStore
module.exports.XAPIService = XAPIService

console.log(CommonHelper)

export default {
  CommonHelper,
}

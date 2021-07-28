"use strict";

const axios = require("axios");
const RemoteLoggingServiceBase = require("./RemoteLoggingServiceBase");

/**
 * query our X API using GraphQL
 */
class XAPIService extends RemoteLoggingServiceBase {
  constructor(graphQLServerUrl, Authorization = "", ApplicationName = "", ApplicationKey = "") {
    super();

    this.graphQLServerUrl = graphQLServerUrl;
    this.Authorization = Authorization;
    this.ApplicationName = ApplicationName;
    this.ApplicationKey = ApplicationKey;

    // this.HttpClient = this.CreateHttpClient(graphQLServerUrl, Authorization, ApplicationName, ApplicationKey);
  }

  /**
   * create the instance, already point to the graphQL server, having appropriate key, token
   * @param {string} baseURL
   * @param {*} Authorization
   * @param {*} ApplicationName
   * @param {*} ApplicationKey
   */
  CreateHttpClient(baseURL, Authorization = "", ApplicationName = "", ApplicationKey = "") {
    return axios.create({
      baseURL,
      headers: {
        Authorization,
        ApplicationName,
        ApplicationKey
      }
    });
  }

  /**
   * POST query command to GraphQL Server
   * @param query
   */
  async Query(query) {
    try {
      var result = await axios({
        method: "POST",
        url: this.graphQLServerUrl,
        headers: {
          Authorization: this.Authorization,
          ApplicationName: this.ApplicationName,
          ApplicationKey: this.ApplicationKey
        },
        data: { query }
      });

      return result.data.data;
    } catch (error) {
      console.error(error);
    }
  }
} // end class

// in order to make this lib live in both node and browser,
// we export to NodeJs if we have the module
// otherwise, we assign to the global window object of Browser
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  /**
   * Node Module exports.
   * @public
   */
  module.exports = XAPIService;
} else {
  window.xcXAPIService = XAPIService;
}
/************** ===================================== */

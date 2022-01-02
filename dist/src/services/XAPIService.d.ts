/**
 * query our X API using GraphQL
 */
export default class XAPIService extends RemoteLoggingServiceBase {
    constructor(graphQLServerUrl: any, Authorization?: string, ApplicationName?: string, ApplicationKey?: string);
    graphQLServerUrl: any;
    Authorization: string;
    ApplicationName: string;
    ApplicationKey: string;
    /**
     * create the instance, already point to the graphQL server, having appropriate key, token
     * @param {string} baseURL
     * @param {*} Authorization
     * @param {*} ApplicationName
     * @param {*} ApplicationKey
     */
    CreateHttpClient(baseURL: string, Authorization?: any, ApplicationName?: any, ApplicationKey?: any): any;
    /**
     * POST query command to GraphQL Server
     * @param query
     */
    Query(query: any): Promise<any>;
}
import RemoteLoggingServiceBase = require("./RemoteLoggingServiceBase");
//# sourceMappingURL=XAPIService.d.ts.map
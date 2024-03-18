/**
 * Util class, no state, to provide Util method to work with Roles, User, token
 * This can be used in web, api (nodejs), so make it totally decouple, follow SOLID principle
 */
export default class AuthHelper {
    static get ADMINROLE(): string;
    /**
     * merge 2 arrays of roles and reduce to distinct
     * [1,2,3] & [2, 3, 4] ==> return [1,2,3,4]
     * @param {Array} arr1
     * @param {Array} arr2
     */
    static mergeRoles(arr1: any[], arr2: any[]): any[];
    /**
     * return array of accepted roles. Admin (this.ADMINROLE) will have all roles accepted.
     * Examples: given "crm,advisor", if user has "crm", this returns [crm] only
     * given "crm,advisor", if user has "admin", this returns [crm,advisor]
     *
     * @param {String} requireRoles required roles, to say user is qualified
     * @param {[String]} userRoles roles of user, to validate with requireRoles
     * @returns {[String]} array of satisfy roles
     */
    static hasRoles(requireRoles: string, userRoles: [string]): [string];
}
//# sourceMappingURL=AuthHelper.d.ts.map
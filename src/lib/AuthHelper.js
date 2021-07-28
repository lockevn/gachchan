"use strict";

/**
 * Util class, no state, to provide Util method to work with Roles, User, token
 * This can be used in web, api (nodejs), so make it totally decouple, follow SOLID principle
 */
class AuthHelper {
  // if there is a constructor present in subclass, it needs to first call super() before using "this".
  constructor() {
    // super();
  }

  static get ADMINROLE() {
    return "admin";
  }  

  /**
   * return array of accepted roles. Admin (this.ADMINROLE) will have all roles accepted.
   * Examples: given "crm,advisor", if user has ["crm"], this returns [crm] only.
   * Given "crm,advisor", if user has ["admin"], this returns [crm,advisor].
   * If requireRoles is "a,b"   and user has ["a","c"], it returns "a" which is satisfied-role of user.
   *
   * @param {String} requireRoles required roles to check, "advisor,admin" ==> check for "advisor" OR "admin"
   * @param {[String]} userRoles array roles of user, to validate with requireRoles. ["crm","advisor"] means this user has 2 roles assigned to his account.
   * @returns {[String]} array of satisfy roles
   */
  static hasRoles(requireRoles, userRoles) {
    let arrRet = [];

    if (!requireRoles || !userRoles || !Array.isArray(userRoles)) {
      // throw Error("require: requireRoles, userRoles");
      return arrRet;
    }

    const arrStringRoles = requireRoles.split(",").map(r => r.trim());

    // check admin first, admin has all roles
    if (userRoles.indexOf(this.ADMINROLE) >= 0) {
      arrRet = arrStringRoles; // all required roles are satisfy
      return arrRet;
    }

    // arrStringRoles == [admin,newseditor,advisor,crm]
    for (let roleToCheck of arrStringRoles) {
      if (userRoles.indexOf(roleToCheck) >= 0) {
        // current user has this role
        arrRet.push(roleToCheck);
      }
    }

    return arrRet;
  } // end func
}


// in order to make this lib live in both node and browser,
// we export to NodeJs if we have the module
// otherwise, we assign to the global window object of Browser
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  /**
   * Node Module exports.
   * @public
   */
  module.exports = AuthHelper;
} else {
  window.xcAuthHelper = AuthHelper;
}
/************** ===================================== */
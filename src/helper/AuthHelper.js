"use strict"

/**
 * Util class, no state, to provide Util method to work with Roles, User, token
 * This can be used in web, api (nodejs), so make it totally decouple, follow SOLID principle
 */
export default class AuthHelper {
  // if there is a constructor present in subclass, it needs to first call super() before using "this".
  constructor() {
    // super();
  }

  static get ADMINROLE() {
    return "admin"
  }

  /**
   * merge 2 arrays of roles and reduce to distinct
   * [1,2,3] & [2, 3, 4] ==> return [1,2,3,4]
   * @param {Array} arr1
   * @param {Array} arr2
   */
  static mergeRoles(arr1, arr2) {
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index
    }

    let distinctArrayOfRoles = arr1.concat(arr2).filter(onlyUnique)
    return distinctArrayOfRoles
  }

  /**
   * return array of accepted roles. Admin (this.ADMINROLE) will have all roles accepted.
   * Examples: given "crm,advisor", if user has "crm", this returns [crm] only
   * given "crm,advisor", if user has "admin", this returns [crm,advisor]
   *
   * @param {String} requireRoles required roles, to say user is qualified
   * @param {[String]} userRoles roles of user, to validate with requireRoles
   * @returns {[String]} array of satisfy roles
   */
  static hasRoles(requireRoles, userRoles) {
    let arrRet = []

    if (!requireRoles || !userRoles || !Array.isArray(userRoles)) {
      // throw Error("require: requireRoles, userRoles");
      return arrRet
    }

    const arrStringRoles = requireRoles.split(",").map(r => r.trim())

    // check admin first, admin has all roles
    if (userRoles.indexOf(this.ADMINROLE) >= 0) {
      arrRet = arrStringRoles // all required roles are satisfy
      return arrRet
    }

    // arrStringRoles == [admin,newseditor,advisor,crm]
    for (let roleToCheck of arrStringRoles) {
      if (userRoles.indexOf(roleToCheck) >= 0) {
        // current user has this role
        arrRet.push(roleToCheck)
      }
    }

    return arrRet
  } // end func
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Util class, no state, to provide Util method to work with Roles, User, token
 * This can be used in web, api (nodejs), so make it totally decouple, follow SOLID principle
 */
var AuthHelper = /** @class */ (function () {
    // if there is a constructor present in subclass, it needs to first call super() before using "this".
    function AuthHelper() {
        // super();
    }
    Object.defineProperty(AuthHelper, "ADMINROLE", {
        get: function () {
            return "admin";
        },
        enumerable: false,
        configurable: true
    });
    /**
     * merge 2 arrays of roles and reduce to distinct
     * [1,2,3] & [2, 3, 4] ==> return [1,2,3,4]
     * @param {Array} arr1
     * @param {Array} arr2
     */
    AuthHelper.mergeRoles = function (arr1, arr2) {
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        var distinctArrayOfRoles = arr1.concat(arr2).filter(onlyUnique);
        return distinctArrayOfRoles;
    };
    /**
     * return array of accepted roles. Admin (this.ADMINROLE) will have all roles accepted.
     * Examples: given "crm,advisor", if user has "crm", this returns [crm] only
     * given "crm,advisor", if user has "admin", this returns [crm,advisor]
     *
     * @param {String} requireRoles required roles, to say user is qualified
     * @param {[String]} userRoles roles of user, to validate with requireRoles
     * @returns {[String]} array of satisfy roles
     */
    AuthHelper.hasRoles = function (requireRoles, userRoles) {
        var arrRet = [];
        if (!requireRoles || !userRoles || !Array.isArray(userRoles)) {
            // throw Error("require: requireRoles, userRoles");
            return arrRet;
        }
        var arrStringRoles = requireRoles.split(",").map(function (r) { return r.trim(); });
        // check admin first, admin has all roles
        if (userRoles.indexOf(this.ADMINROLE) >= 0) {
            arrRet = arrStringRoles; // all required roles are satisfy
            return arrRet;
        }
        // arrStringRoles == [admin,newseditor,advisor,crm]
        for (var _i = 0, arrStringRoles_1 = arrStringRoles; _i < arrStringRoles_1.length; _i++) {
            var roleToCheck = arrStringRoles_1[_i];
            if (userRoles.indexOf(roleToCheck) >= 0) {
                // current user has this role
                arrRet.push(roleToCheck);
            }
        }
        return arrRet;
    }; // end func
    return AuthHelper;
}());
exports.default = AuthHelper;

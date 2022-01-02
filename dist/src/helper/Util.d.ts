/**
 * Old util class from 2017, will be merged to CommonHelper
 */
export default class Util {
    /**
     *
     * @param {*} min
     * @param {*} max
     */
    static GetRandomNumberBetween(min: any, max: any): number;
    /**
     * split string into array, remove empty entries, each output string is trimmed
     * "1,2,3 ,,, 4, 5 ,6" ==> [1,2,3,4,5,6]
     * @param {*} strCommaSeparated
     */
    static splitByCommaAndTrim(strCommaSeparated: any): any;
    /**
     * merge 2 arrays of entries and reduce to distinct
     * [1,2,3] & [2, 3, 4] ==> return [1,2,3,4]
     * @param {Array} arr1
     * @param {Array} arr2
     */
    static mergeAndDistinct(arr1: any[], arr2: any[]): any[];
    /**
     * give you the Date object, from the jsonDateString (return from some API services)
     * @param {String} jsonDateString string of this format "/Date(2342353453434)/"
     */
    static parseJsonDate(jsonDateString: string): Date;
    /**
     * Joins path segments.  Preserves initial "/" and resolves ".." and "."
     * Does not support using ".." to go above/outside the root.
     * This means that join("foo", "../../bar") will not resolve to "../bar"
     */
    static joinPath(...args: any[]): string;
    /**
     * A simple function to get the dirname of a path
     * Trailing slashes are ignored. Leading slash is preserved.
     * @param {*} path
     */
    static dirname(path: any): any;
}
//# sourceMappingURL=Util.d.ts.map
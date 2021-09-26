"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dist_1 = require("../../dist");
var target = dist_1.Util;
describe("Util", function () {
    describe("GetRandomNumberBetween(10, 20)", function () {
        it("GetRandomNumberBetween(10, 20)", function () {
            expect(target.GetRandomNumberBetween(11, 19)).toBeLessThan(20);
            expect(target.GetRandomNumberBetween(11, 19)).toBeGreaterThan(10);
        });
    });
    describe("splitByCommaAndTrim()", function () {
        it("1,2,3 ,,, 4, 5 ,6 should be [1,2,3,4,5,6]", function () {
            var actual = target.splitByCommaAndTrim("1,2,3 ,,, 4, 5 ,6");
            expect(actual.length).toBe(6);
            expect(actual[0]).toBe("1");
            expect(actual[5]).toBe("6");
        });
    });
    describe("mergeAndDistinct", function () {
        it("123 and 453 should be 12345", function () {
            var actual = target.mergeAndDistinct([1, 2, 3], [4, 5, 3]);
            expect(actual.indexOf(4) >= 0).toBeTruthy();
            expect(actual.indexOf(5) >= 0).toBeTruthy();
        });
    });
    describe("parseJsonDate", function () {
        it("/Date(2342353453434)/ should be 'Wed Mar 23 2044 20:44:13 GMT+0700 (Indochina Time)'", function () {
            var actual = target.parseJsonDate("/Date(2342353453434)/");
            expect(actual.getUTCFullYear() === 2044).toBeTruthy();
            expect(actual.getUTCMonth() === 2).toBeTruthy(); // from 0
            expect(actual.getUTCDate() === 23).toBeTruthy();
        });
    });
    describe("joinPath", function () {
        test("join a and b should be a/b", function () {
            expect(target.joinPath("a", "b")).toBe("a/b");
            expect(target.joinPath("a/", "b")).toBe("a/b");
            expect(target.joinPath("a", "/b")).toBe("a/b");
            expect(target.joinPath("/a/", "/b")).toBe("/a/b");
        });
        test("join /a and b should be /a/b", function () {
            expect(target.joinPath("/a/", "/b")).toBe("/a/b");
        });
    });
});

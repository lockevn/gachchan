//During the test the env variable is set to test
process.env.NODE_ENV = "test";

//Require the dev-dependencies
let chai = require("chai");
let should = chai.should();
let assert = chai.assert;

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var { Util, AuthHelper } = require("..");

describe("Util", () => {
  describe("randomIntTo", () => {
    it("it should not less than 22", done => {
      Util.randomIntTo(22).should.lessThan(22);
      done();
    });
  });

  describe("roundToTwo", () => {
    it("it should has 2 digit after dot", done => {
      Util.roundToTwo(1.1111).should.eq(1.11);
      done();
    });
  });

  describe("GetRandomNumberBetween(10, 20)", () => {
    it("GetRandomNumberBetween(10, 20)", done => {
      Util.GetRandomNumberBetween(11, 19).should.lessThan(20);
      Util.GetRandomNumberBetween(11, 19).should.greaterThan(10);
      done();
    });
  });

  describe("splitByCommaAndTrim()", () => {
    it("1,2,3 ,,, 4, 5 ,6 should be [1,2,3,4,5,6]", done => {
      let ret = Util.splitByCommaAndTrim("1,2,3 ,,, 4, 5 ,6");
      // assert.arraylength(ret);
      assert.isTrue(ret.length == 6);
      assert.isTrue(ret[0] == "1");
      assert.isTrue(ret[5] == "6");
      done();
    });
  });

  describe("mergeAndDistinct", () => {
    it("123 and 453 should be 12345", done => {
      let actual = Util.mergeAndDistinct([1, 2, 3], [4, 5, 3]);
      assert.isTrue(actual.indexOf(4) >= 0);
      assert.isTrue(actual.indexOf(5) >= 0);
      done();
    });
  });

  describe("parseJsonDate", () => {
    it("/Date(2342353453434)/ should be 'Wed Mar 23 2044 20:44:13 GMT+0700 (Indochina Time)'", done => {
      let actual = Util.parseJsonDate("/Date(2342353453434)/");

      assert.isTrue(actual.getUTCFullYear() === 2044);
      assert.isTrue(actual.getUTCMonth() === 2); // from 0
      assert.isTrue(actual.getUTCDate() === 23);
      done();
    });
  });

  describe("joinPath", () => {
    test("join a and b should be a/b", () => {
      expect(Util.joinPath("a", "b")).toBe("a/b");
      expect(Util.joinPath("a/", "b")).toBe("a/b");
      expect(Util.joinPath("a", "/b")).toBe("a/b");
      expect(Util.joinPath("/a/", "/b")).toBe("/a/b");
    });

    test("join /a and b should be /a/b", () => {
      expect(Util.joinPath("/a/", "/b")).toBe("/a/b");
    });
  });

  // describe("generateRandomPriceData", function() {
  //   it("generateRandomPriceData", function() {
  //     // mock data, with max variation = 7%
  //     function generateRandomPriceData(_startingPrice, _limitLength) {
  //       var arrFakeData = [_startingPrice];
  //       for (var i = 1; i < _limitLength; i++) {
  //         var cur = arrFakeData[i - 1];
  //         var r =
  //           cur *
  //           (1 + ((Math.random() > 0.5 ? -1 : 1) * Math.random()) / 14.28);
  //         arrFakeData.push(xcUtil.roundToTwo(r));
  //       }
  //       return arrFakeData;
  //     }

  //     var arr = generateRandomPriceData(100, 10);
  //     assert.equal(arr.length, 10);
  //     assert.equal(arr[0], 100);
  //   });
  // });
});

// JEST
// //uppercase.test.js
// const uppercase = require('./uppercase')
// test(`uppercase 'test' to equal 'TEST'`, async () => {
//   const str = await uppercase('test')
//   expect(str).toBe('TEST')
// })

describe("AuthHelper", () => {
  describe("hasRoles", () => {
    it("it should return satisfied roles", done => {
      let actual = AuthHelper.hasRoles("admin", ["admin"]);
      assert.isTrue(actual.indexOf("admin") === 0);

      actual = AuthHelper.hasRoles("admin,crm,advisor", ["admin"]);
      assert.isTrue(actual.indexOf("admin") >= 0);
      assert.isTrue(actual.indexOf("crm") >= 0);
      assert.isTrue(actual.indexOf("advisor") >= 0);

      actual = AuthHelper.hasRoles("admin,crm,advisor", ["crm"]);
      assert.isTrue(actual.indexOf("crm") === 0);

      actual = AuthHelper.hasRoles("admin,crm", ["crm"]);
      assert.isTrue(actual.indexOf("crm") === 0);

      actual = AuthHelper.hasRoles("admin,advisor", ["crm"]);
      assert.isTrue(actual.indexOf("crm") < 0);

      actual = AuthHelper.hasRoles("sysadmin,a,b,advisor", ["crm", "advisor"]);
      assert.isTrue(actual.indexOf("advisor") == 0);
      assert.isTrue(actual.indexOf("crm") < 0);

      done();
    });
  });
});

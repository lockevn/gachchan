
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "HtmlHelper", () => $7c6de66f1f0b95fb$export$937d9eae8ee9d05e);
"use strict";
class $7c6de66f1f0b95fb$export$937d9eae8ee9d05e {
    /**
   *
   * @param {string} bodyHtml
   * @param {string[]} tags [style, script, svg]
   * @returns
   */ static cleanupHtmlTags(bodyHtml, tags) {
        const tagRegExp = new RegExp(`<(${tags.join("|")})[^>]*>.*?<\\/\\1>`, "igms");
        return bodyHtml.replace(tagRegExp, "");
    }
} // end class


//# sourceMappingURL=HtmlHelper.88e12c61.js.map

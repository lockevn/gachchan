"use strict";
class $683d784e2c30f394$export$937d9eae8ee9d05e {
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


export {$683d784e2c30f394$export$937d9eae8ee9d05e as HtmlHelper};
//# sourceMappingURL=HtmlHelper.146e2101.js.map

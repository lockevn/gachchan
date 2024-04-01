"use strict"

export default class HtmlHelper {
  /**
   *
   * @param {string} bodyHtml
   * @param {string[]} tags [style, script, svg]
   * @returns
   */
  static cleanupHtmlTags(bodyHtml, tags) {
    const tagRegExp = new RegExp(`<(${tags.join("|")})[^>]*>.*?<\\/\\1>`, "igms")
    return bodyHtml.replace(tagRegExp, "")
  }
} // end class

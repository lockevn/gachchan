"use strict"

export class HtmlHelper {
  /**
   *
   * @param {string} bodyHtml
   * @param {string[]} tags [style, script, svg]
   * @returns
   */
  static cleanupHtmlTags(bodyHtml: string, tags: string[]) {
    const tagRegExp = new RegExp(`<(${tags.join("|")})[^>]*>.*?<\\/\\1>`, "igms")
    return bodyHtml.replace(tagRegExp, "")
  }
} // end class

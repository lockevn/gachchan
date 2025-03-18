/** helper to represent/layout/format text */
export class TextHelper {
  /** change 1 to 1️⃣ (unicode square box character) */
  static representNumberInIconicDigit(numberString: string | null | undefined): string {
    if (!numberString) {
      return ''
    }

    let ret = numberString.toString()
    ret = ret
      .replace(/0/g, '0️⃣')
      .replace(/1/g, '1️⃣')
      .replace(/2/g, '2️⃣')
      .replace(/3/g, '3️⃣')
      .replace(/4/g, '4️⃣')
      .replace(/5/g, '5️⃣')
      .replace(/6/g, '6️⃣')
      .replace(/7/g, '7️⃣')
      .replace(/8/g, '8️⃣')
      .replace(/9/g, '9️⃣')

    return ret
  }

  /** convert true false to yes/no or icon of yes/no */
  static boolToYesNo(b?: boolean, withText = false) {
    const text = b ? 'yes' : 'no '
    const icon = b ? '✅' : '🚫'

    return icon + (withText ? text : '')
  }
}

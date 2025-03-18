import { test, assert, expect, it, describe, beforeAll, afterAll, vi } from 'vitest'

import { TextHelper } from './TextHelper'
const target = TextHelper

describe('CommonHelper', () => {
  it('RepresentNumberInIconicDigit', () => {
    expect(target.representNumberInIconicDigit(undefined)).toBe('')
    expect(target.representNumberInIconicDigit(null)).toBe('')
    expect(target.representNumberInIconicDigit('')).toBe('')
    expect(target.representNumberInIconicDigit('000123456789')).toBe('0️⃣0️⃣0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣')
  })
})

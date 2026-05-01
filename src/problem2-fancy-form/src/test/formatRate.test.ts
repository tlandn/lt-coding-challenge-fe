import { formatRate } from '../components/SwapForm'

describe('formatRate', () => {
  it('returns 4 decimal places for values >= 1', () => {
    expect(formatRate(1)).toBe('1.0000')
    expect(formatRate(1234.5678)).toBe('1234.5678')
    expect(formatRate(100)).toBe('100.0000')
  })

  it('returns 6 decimal places for values between 0.0001 and 1', () => {
    expect(formatRate(0.5)).toBe('0.500000')
    expect(formatRate(0.001234)).toBe('0.001234')
    expect(formatRate(0.0001)).toBe('0.000100')
  })

  it('returns 8 decimal places for values less than 0.0001', () => {
    expect(formatRate(0.00005)).toBe('0.00005000')
    expect(formatRate(0.00001234)).toBe('0.00001234')
    expect(formatRate(0.00000001)).toBe('0.00000001')
  })
})

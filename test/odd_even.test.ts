/* globals describe, expect, test */
import OddEven from '../src/odd_even'

describe('test odd_even', (): void => {
  test('odd', (): void => {
    const resp: boolean = OddEven(1)
    expect(resp).toBe(false)
  })

  test('even', (): void => {
    const resp: boolean = OddEven(2)
    expect(resp).toBe(true)
  })
})

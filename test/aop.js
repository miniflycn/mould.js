/* eslint-env mocha */
import { before, after } from '../lib/aop'

describe('cache', () => {
  it('should able to use before', () => {
    let firstRun = false
    const first = () => {
      firstRun = true
    }
    const second = () => {
      if (!firstRun) throw new Error('first function need run first')
    }
    const res = before(second, first)
    res()
  })

  it('should able to use after', () => {
    let firstRun = false
    const first = () => {
      firstRun = true
    }
    const second = () => {
      if (!firstRun) throw new Error('first function need run first')
    }
    const res = after(first, second)
    res()
  })
})

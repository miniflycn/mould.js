/* eslint-env mocha */
import { set, get } from '../lib/cache'

describe('cache', () => {
  it('should able to set & get a value', () => {
    set('key', 'value')
    get('key').should.equal('value')
  })
})

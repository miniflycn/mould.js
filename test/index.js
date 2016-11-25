/* eslint-env mocha */
import { create } from '../lib/'

describe('create', () => {
  it('should create a Origin have a correct name', () => {
    const Component1 = create('test', {})
    Component1.__Origin__.__name__.should.equal('test') // eslint-disable-line
    Component1.__Origin__.name.should.equal('Test') // eslint-disable-line
    const Component2 = create('test-haha', {})
    Component2.__Origin__.__name__.should.equal('test-haha') // eslint-disable-line
    Component2.__Origin__.name.should.equal('TestHaha') // eslint-disable-line
  })
})

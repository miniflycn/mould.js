/* eslint-env mocha */
import Seed from '../lib/seed'
import inherit from '../lib/inherit'

describe('inherit', () => {
  it('should able to use prepare', () => {
    function Child() {
      Seed.call(this)
    }
    inherit(Child, Seed)
    Object.assign(Child.prototype, {
      prepare() {
        this.hasInit = true
      },
    })
    const child = new Child
    child.hasInit.should.be.true // eslint-disable-line
  })

  it('should able to set a element', () => {
    function Child() {
      Seed.call(this)
    }
    inherit(Child, Seed)
    Object.assign(Child.prototype, {
      get() {
        return this.element
      },
    })

    const child = new Child
    const mockElement = {}
    child.init(mockElement)
    child.get().should.be.equal(mockElement)
  })
})

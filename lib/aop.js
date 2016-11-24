export const before = function before(fn, be) {
  return function caller(...args) {
    if (be.apply(this, args) === false) {
      return false
    }
    return fn.apply(this, args)
  }
}

export const after = function after(fn, af) {
  return function caller(...args) {
    const ret = fn.apply(this, args)
    if (ret === false) return false
    af.apply(this, args)
    return ret
  }
}

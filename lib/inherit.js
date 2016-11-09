export default (a, b) => {
  function Fn() {}
  Fn.prototype = b.prototype
  a.prototype = new Fn // eslint-disable-line
  a.prototype.constructor = a // eslint-disable-line
}

function Seed() {
  // prepare some context
  if (this.prepare) this.prepare()
}
// state, props, children
Seed.prototype.render = function render(state, props, children) {
  return this.tpl(state, props, children)
}
Seed.prototype.init = function init(element) {
  this.element = element
}

export default Seed

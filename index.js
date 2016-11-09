import inherit from './lib/inherit'
import { get, set } from './lib/cache'
import { transform, print, createElement, resolve as re } from './lib/manipulate'

function Seed() {}
// state, props, children
Seed.prototype.render = function render(state, props, children) {
  return this.tpl(state, props, children)
}

export const create = (name, prototype, staticProps, Super) => {
  let Child = get(name)
  if (Child == null) {
    /* eslint-disable */
    Super = Super ? Super.__Origin__ : Seed
    const Origin = function () {
      Super.call(this)
    }
    inherit(Origin, Super)
    Object.assign(Origin, Super, staticProps)
    if (prototype) Object.assign(Origin.prototype, prototype)
    // mark name
    Origin.__name__ = name
    /* eslint-enable */
    // transform Origin to the real Element
    Child = transform(Origin)
    set(name, Child)
  }
  return Child
}

export const render = (container, Element, props) => {
  const element = createElement(Element, props)
  print(container, element)
}

export const resolve = (config) => {
  re(config)
  if (typeof config.match === 'string') create(config.match)
}

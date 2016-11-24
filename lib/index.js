import inherit from './inherit'
import { get as get_, set } from './cache'
import { transform, print, createElement, resolve as re } from './manipulate'
import Seed from './seed'

export const create = (name, prototype, staticProps, Super) => {
  let Child = get_(name)
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

export const get = get_

export default { createElement }

export const render = (container, Element, props) => {
  const element = createElement(Element, props)
  print(container, element)
}

export const resolve = (config) => {
  re(config)
  if (typeof config.match === 'string') create(config.match)
}

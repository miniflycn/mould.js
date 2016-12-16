import inherit from './inherit'
import { get as get_, set } from './cache'
import { transform, print, createElement, resolve as re } from './manipulate'
import Seed from './seed'
import extend from 'xtend/mutable'

export const create = (name, prototype, staticProps, Super) => {
  let Child = get_(name)
  if (Child == null) {
    /* eslint-disable */
    Super = Super ? Super.__Origin__ : Seed
    const constructorName = name.split('-')
      .map(v => `${v.charAt(0).toUpperCase()}${v.substring(1)}`)
      .join('')
    const Origin = (new Function('Super', `return function ${constructorName}() {
  Super.call(this)
}`))(Super)
    inherit(Origin, Super)
    extend(Origin, Super, staticProps)
    if (prototype) extend(Origin.prototype, prototype)
    // mark name
    Origin.__name__ = name
    /* eslint-enable */
    // transform Origin to the real Element
    Child = transform(Origin)
    set(name, Child)
  } else {
    throw new Error(`You should not redefined ${name}`)
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

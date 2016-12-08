import React from 'react'
import ReactDom from 'react-dom'
import { get } from './cache'
import { before, after } from './aop'

const aop = { before, after }

/**
 * {
 *  match: Regex || Function,
 *  transform?: Function,
 *  createElement?: Function
 * }
 */
const resolves = []

function solve(type, Origin) {
  let fn
  resolves.every((config) => {
    const match = config.match
    let flag = true
    /* eslint-disable */
    switch (typeof match) {
      case 'string':
        if (match === Origin.__name__) flag = false
        break
      case 'function':
        if (match(Origin)) flag = false
        break
      case 'object':
        if (match.test(Origin.__name__)) flag = false
        break
      default:
        break
    }
    /* eslint-enable */
    if (!flag) fn = config[type]
    return flag
  })
  return fn
}

/**
 * create a framework component instance
 */
export const createElement = (Element, props, ...args) => {
  args.unshift(Element, props)
  if (Element.__Origin__ && get(Element.__Origin__.__name__)) {  // eslint-disable-line
    const fn = solve('createElement', Element.__Origin__) // eslint-disable-line
    if (fn) return fn.apply(null, args)
  }
  return React.createElement.apply(null, args)
}

/**
 * Element
 * {
 *  tagname: String,
 *  content?: String,
 *  children: Array(Element),
 *  props: Object,
 *  key?: String || Number
 * }
 */
function trans(ele) {
  if (ele == null) return null
  if (ele.tagname === 'text') return ele.content
  const children = ele.children
  const props = Object.assign({}, ele.props, ele.key != null ? { key: ele.key } : null)
  const args = [
    get(ele.tagname) || ele.tagname,
    props,
  ]
  if (children && children.length) {
    args.push.apply(args, children.map(childEle => trans(childEle)))
  }
  return createElement.apply(null, args)
}

/**
 * transform a Origin to a framework component
 */
export const transform = (Origin) => {
  const fn = solve('transform', Origin)
  let res
  if (fn) {
    res = fn(Origin)
  } else {
    const origin = new Origin
    const param = {
      getInitialState() { return Origin.state || {} },
      render: function render() {
        // run init
        if (origin.element !== this) origin.init(this)
        const dom = origin.render(this.state, this.props, this.children)
        return React.isValidElement(dom) ? dom : trans(dom)
      },
    }
    if (origin.bindEvent) param.componentDidMount = origin.bindEvent.bind(origin)
    if (origin.aop && origin.aop['after:bindEvent'] && !param.componentDidMount) {
      param.componentDidMount = function bindEvent() {}
    }
    if (origin.aop) {
      Object.keys(origin.aop).map(key => {
        const ret = key.split(':')
        ret.push(origin.aop[key])
        return ret
      }).forEach(item => {
        const foo = aop[item[0]]
        switch (item[1]) {
          case 'render':
            param.render = foo(param.render, item[2])
            break
          case 'bindEvent':
            param.componentDidMount = foo(param.componentDidMount, item[2])
            break
          default:
            break
        }
      })
    }
    res = React.createClass(param)
  }
  res.__Origin__ = Origin // eslint-disable-line
  return res
}

/**
 * for now, it just one way to print
 */
export const print = (container, element) => {
  ReactDom.render(element, container)
}

export const resolve = (config) => {
  // just push resolve config
  resolves.push(config)
}

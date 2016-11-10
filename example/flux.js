import { create, render, resolve } from '../'
import ReactBox from './component/react-box/box.jsx'
import { Container } from 'flux/utils'
import React from 'react'
import store from './infra/store'
const container = document.getElementById('container')

const pack = (state, kvs) => {
  const res = {}
  kvs.forEach(kv => {
    res[kv.k] = kv.v(state)
  })
  return res
}

resolve({
  match(Origin) { return !!Origin.__react__ }, // eslint-disable-line
  transform(Origin) { return Origin.__react__ }, // eslint-disable-line
  createElement(Element, props, children) {
    const kvs = []
    let Res = Element
    Object.keys(props).forEach(key => {
      if (key.indexOf('@') === 0) {
        kvs.push({
          k: key.slice(1),
          v: props[key],
        })
      }
    })
    if (kvs.length) {
      const config = {
        getStores: () => [store],
        calculateState: (() =>
          () => {
            const state = store.getState()
            return pack(state, kvs)
          }
        )(),
      }
      Res = typeof Res === 'function' ?
        Container.createFunctional(Res, config.getStores, config.calculateState) :
        Container.create(Object.assign(Res, config))
    }
    return React.createElement(Res, props, children)
  },
})
create('react-box', null, { __react__: ReactBox })

render(container, create('app', {
  render() {
    // 通过结构树产生页面
    // 所以只要对接产生结构树的工具即可
    const res = {
      tagname: 'div',
      children: [
        {
          tagname: 'react-box',
          props: {
            '@value': (state) => state.msg,
          },
        },
      ],
    }
    return res
  },
}))

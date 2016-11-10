import { create, render, resolve } from '../'
import { init } from './component/3-list/list'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
const container = document.getElementById('container')

resolve({
  match: /^3-/,
  transform: (Origin) => {
    const origin = new Origin
    class Third extends Component {
      componentDidMount() {
        origin.init(ReactDOM.findDOMNode(this))
      }
      render() {
        return <div></div>
      }
    }
    return Third
  },
})
create('3-list', { init: init }) // eslint-disable-line

render(container, create('app', {
  render() {
    // 通过结构树产生页面
    // 所以只要对接产生结构树的工具即可
    const res = {
      tagname: 'div',
      children: [
        {
          tagname: '3-list',
        },
      ],
    }
    return res
  },
}))

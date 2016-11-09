import { create, render, resolve } from '../'
import ReactList from './component/react-list/list.jsx'
const container = document.getElementById('container')

resolve({
  match: (Origin) => { return !!Origin.__react__ }, // eslint-disable-line
  transform: (Origin) => Origin.__react__, // eslint-disable-line
})
create('react-list', null, { __react__: ReactList })

render(container, create('app', {
  render: () => {
    // 通过结构树产生页面
    // 所以只要对接产生结构树的工具即可
    const res = {
      tagname: 'div',
      children: [
        {
          tagname: 'react-list',
        },
      ],
    }
    return res
  },
}))

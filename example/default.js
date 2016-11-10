import { create, render } from '../'
const container = document.getElementById('container')

create('hello', {
  render() {
    const res = {
      tagname: 'p',
      children: [{
        tagname: 'text',
        content: 'hello world',
      }],
    }
    return res
  },
})

render(container, create('app', {
  render() {
    // 通过结构树产生页面
    // 所以只要对接产生结构树的工具即可
    const res = {
      tagname: 'div',
      children: [
        {
          tagname: 'hello',
        },
      ],
    }
    return res
  },
}))

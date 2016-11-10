import { ambi, render } from './lib/plugin'

ambi('xxx', {
  css: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/css/super_min_a2275124.css',
  render() { // eslint-disable-line
    const res = {
      tagname: 'button',
      props: {
        onClick: this.handleClick.bind(this), // eslint-disable-line
      },
      children: [
        {
          tagname: 'text',
          content: 'hello world',
        },
      ],
    }
    return res
  },
  handleClick() {
    this.show('hello world')
  },
})

ambi('yyy', {
  render() {
    const res = {
      tagname: 'p',
      children: [
        {
          tagname: 'text',
          content: '点击上面按钮：',
        },
      ],
    }
    return res
  },
})

render(document.getElementById('container'))

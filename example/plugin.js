import { ambi, render } from './lib/plugin'

ambi('xxx', {
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

render(document.getElementById('container'))

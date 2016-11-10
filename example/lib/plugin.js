import { create, render as re } from '../../'
const cache = {
  ambi: [],
}
export const App = create('app', {
  render: () => {
    const res = {
      tagname: 'div',
      children: [
        {
          tagname: 'div',
          props: {
            className: 'ambi',
          },
          children: cache.ambi,
        },
      ],
    }
    return res
  },
})

const Ambi = create('ambi', {
  prepare() {
    if (this.css) {
      if (typeof this.css === 'string') this.css = [this.css]
      this.css.forEach(url => {
        const head = document.getElementsByTagName('head')[0]
        const link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('type', 'text/css')
        link.setAttribute('href', url)
        head.appendChild(link)
      })
    }
  },
  show(msg) { alert(msg) },
})

export const ambi = (name, proto) => {
  create(name, proto, null, Ambi)
  cache.ambi.push({
    tagname: name,
  })
}

export const render = container => {
  re(container, App)
}

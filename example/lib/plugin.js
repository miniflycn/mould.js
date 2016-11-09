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

const Ambi = create('ambi', { show: msg => { alert(msg) } })

export const ambi = (name, proto) => {
  create(name, proto, null, Ambi)
  cache.ambi.push({
    tagname: name,
  })
}

export const render = container => {
  re(container, App)
}

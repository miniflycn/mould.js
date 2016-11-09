export const bind = (container) => {
  container.addEventListener('click', () => {
    alert('click me') // eslint-disable-line
  })
}
export const init = (container) => {
  container.innerHTML = '<button>hello world</button>' // eslint-disable-line
  bind(container)
}

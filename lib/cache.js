const _ = {}

export const set = (key, value) => {
  _[key] = value
}

export const get = (key) => _[key]

const _ = {}

exports.set = (key, value) => {
  _[key] = value
}

exports.get = (key) => _[key]

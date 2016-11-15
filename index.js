'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var ReactDom = _interopDefault(require('react-dom'));

var inherit = (a, b) => {
  function Fn() {}
  Fn.prototype = b.prototype;
  a.prototype = new Fn; // eslint-disable-line
  a.prototype.constructor = a; // eslint-disable-line
};

const _ = {};

const set = (key, value) => {
  _[key] = value;
};

const get = (key) => _[key];

/**
 * {
 *  match: Regex || Function,
 *  transform?: Function,
 *  createElement?: Function
 * }
 */
const resolves = [];

function solve(type, Origin) {
  let fn;
  resolves.every((config) => {
    const match = config.match;
    let flag = true;
    /* eslint-disable */
    switch (typeof match) {
      case 'string':
        if (match === Origin.__name__) flag = false;
        break
      case 'function':
        if (match(Origin)) flag = false;
        break
      case 'object':
        if (match.test(Origin.__name__)) flag = false;
        break
      default:
        break
    }
    /* eslint-enable */
    if (!flag) fn = config[type];
    return flag
  });
  return fn
}

/**
 * create a framework component instance
 */
const createElement = (Element, props, ...args) => {
  args.unshift(Element, props);
  if (Element.__Origin__ && get(Element.__Origin__.__name__)) {  // eslint-disable-line
    const fn = solve('createElement', Element.__Origin__); // eslint-disable-line
    if (fn) return fn.apply(null, args)
  }
  return React.createElement.apply(null, args)
};

/**
 * Element
 * {
 *  tagname: String,
 *  content?: String,
 *  children: Array(Element),
 *  props: Object,
 *  key?: String || Number
 * }
 */
function trans(ele) {
  if (ele.tagname === 'text') return ele.content
  const children = ele.children;
  const props = Object.assign({}, ele.props, ele.key != null ? { key: ele.key } : null);
  const args = [
    get(ele.tagname) || ele.tagname,
    props,
  ];
  if (children && children.length) {
    args.push.apply(args, children.map(childEle => trans(childEle)));
  }
  return createElement.apply(null, args)
}

/**
 * transform a Origin to a framework component
 */
const transform = (Origin) => {
  const fn = solve('transform', Origin);
  let res;
  let param;
  if (fn) {
    res = fn(Origin);
  } else {
    const origin = new Origin;
    param = {
      getInitialState: function getInitialState() { return origin.state || {} },
      render: function render() {
        const dom = origin.render(this.state, this.props, this.children);
        return trans(dom)
      },
    };
  }
  if (param) res = React.createClass(param);
  res.__Origin__ = Origin; // eslint-disable-line
  return res
};

/**
 * for now, it just one way to print
 */
const print = (container, element) => {
  ReactDom.render(element, container);
};

const resolve$1 = (config) => {
  // just push resolve config
  resolves.push(config);
};

function Seed() {
  // prepare some context
  if (this.prepare) this.prepare();
}
// state, props, children
Seed.prototype.render = function render(state, props, children) {
  return this.tpl(state, props, children)
};

const create = (name, prototype, staticProps, Super) => {
  let Child = get(name);
  if (Child == null) {
    /* eslint-disable */
    Super = Super ? Super.__Origin__ : Seed;
    const Origin = function () {
      Super.call(this);
    };
    inherit(Origin, Super);
    Object.assign(Origin, Super, staticProps);
    if (prototype) Object.assign(Origin.prototype, prototype);
    // mark name
    Origin.__name__ = name;
    /* eslint-enable */
    // transform Origin to the real Element
    Child = transform(Origin);
    set(name, Child);
  }
  return Child
};

const render$1 = (container, Element, props) => {
  const element = createElement(Element, props);
  print(container, element);
};

const resolve$$1 = (config) => {
  resolve$1(config);
  if (typeof config.match === 'string') create(config.match);
};

exports.create = create;
exports.render = render$1;
exports.resolve = resolve$$1;

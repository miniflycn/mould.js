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

const get$1 = (key) => _[key];

const before = function before(fn, be) {
  return function caller(...args) {
    if (be.apply(this, args) === false) {
      return false
    }
    return fn.apply(this, args)
  }
};

const after = function after(fn, af) {
  return function caller(...args) {
    const ret = fn.apply(this, args);
    if (ret === false) return false
    af.apply(this, args);
    return ret
  }
};

const aop = { before, after };

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
  if (Element.__Origin__ && get$1(Element.__Origin__.__name__)) {  // eslint-disable-line
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
    get$1(ele.tagname) || ele.tagname,
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
  if (fn) {
    res = fn(Origin);
  } else {
    const origin = new Origin;
    const param = {
      getInitialState() { return Origin.state || {} },
      render: function render() {
        // run init
        if (origin.element !== this) origin.init(this);
        const dom = origin.render(this.state, this.props, this.children);
        return React.isValidElement(dom) ? dom : trans(dom)
      },
    };
    if (origin.bindEvent) param.componentDidMount = origin.bindEvent.bind(origin);
    if (origin.aop && origin.aop['after:bindEvent'] && !param.componentDidMount) {
      param.componentDidMount = function bindEvent() {};
    }
    if (origin.aop) {
      Object.keys(origin.aop).map(key => {
        const ret = key.split(':');
        ret.push(origin.aop[key]);
        return ret
      }).forEach(item => {
        const foo = aop[item[0]];
        switch (item[1]) {
          case 'render':
            param.render = foo(param.render, item[2]);
            break
          case 'bindEvent':
            param.componentDidMount = foo(param.componentDidMount, item[2]);
            break
          default:
            break
        }
      });
    }
    res = React.createClass(param);
  }
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
Seed.prototype.init = function init(element) {
  this.element = element;
};

const create = (name, prototype, staticProps, Super) => {
  let Child = get$1(name);
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

const get$$1 = get$1;

var index = { createElement };

const render$1 = (container, Element, props) => {
  const element = createElement(Element, props);
  print(container, element);
};

const resolve$$1 = (config) => {
  resolve$1(config);
  if (typeof config.match === 'string') create(config.match);
};

exports.create = create;
exports.get = get$$1;
exports['default'] = index;
exports.render = render$1;
exports.resolve = resolve$$1;

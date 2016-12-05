'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var ReactDom = _interopDefault(require('react-dom'));

var inherit = (function (a, b) {
  function Fn() {}
  Fn.prototype = b.prototype;
  a.prototype = new Fn(); // eslint-disable-line
  a.prototype.constructor = a; // eslint-disable-line
});

var _ = {};

var set = function set(key, value) {
  _[key] = value;
};

var get$1 = function get$1(key) {
  return _[key];
};

var before = function before(fn, be) {
  return function caller() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (be.apply(this, args) === false) {
      return false;
    }
    return fn.apply(this, args);
  };
};

var after = function after(fn, af) {
  return function caller() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var ret = fn.apply(this, args);
    if (ret === false) return false;
    af.apply(this, args);
    return ret;
  };
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var aop = { before: before, after: after };

/**
 * {
 *  match: Regex || Function,
 *  transform?: Function,
 *  createElement?: Function
 * }
 */
var resolves = [];

function solve(type, Origin) {
  var fn = void 0;
  resolves.every(function (config) {
    var match = config.match;
    var flag = true;
    /* eslint-disable */
    switch (typeof match === 'undefined' ? 'undefined' : _typeof(match)) {
      case 'string':
        if (match === Origin.__name__) flag = false;
        break;
      case 'function':
        if (match(Origin)) flag = false;
        break;
      case 'object':
        if (match.test(Origin.__name__)) flag = false;
        break;
      default:
        break;
    }
    /* eslint-enable */
    if (!flag) fn = config[type];
    return flag;
  });
  return fn;
}

/**
 * create a framework component instance
 */
var createElement = function createElement(Element, props) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  args.unshift(Element, props);
  if (Element.__Origin__ && get$1(Element.__Origin__.__name__)) {
    // eslint-disable-line
    var fn = solve('createElement', Element.__Origin__); // eslint-disable-line
    if (fn) return fn.apply(null, args);
  }
  return React.createElement.apply(null, args);
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
  if (ele.tagname === 'text') return ele.content;
  var children = ele.children;
  var props = Object.assign({}, ele.props, ele.key != null ? { key: ele.key } : null);
  var args = [get$1(ele.tagname) || ele.tagname, props];
  if (children && children.length) {
    args.push.apply(args, children.map(function (childEle) {
      return trans(childEle);
    }));
  }
  return createElement.apply(null, args);
}

/**
 * transform a Origin to a framework component
 */
var transform = function transform(Origin) {
  var fn = solve('transform', Origin);
  var res = void 0;
  if (fn) {
    res = fn(Origin);
  } else {
    (function () {
      var origin = new Origin();
      var param = {
        getInitialState: function getInitialState() {
          return Origin.state || {};
        },

        render: function render() {
          // run init
          if (origin.element !== this) origin.init(this);
          var dom = origin.render(this.state, this.props, this.children);
          return React.isValidElement(dom) ? dom : trans(dom);
        }
      };
      if (origin.bindEvent) param.componentDidMount = origin.bindEvent.bind(origin);
      if (origin.aop && origin.aop['after:bindEvent'] && !param.componentDidMount) {
        param.componentDidMount = function bindEvent() {};
      }
      if (origin.aop) {
        Object.keys(origin.aop).map(function (key) {
          var ret = key.split(':');
          ret.push(origin.aop[key]);
          return ret;
        }).forEach(function (item) {
          var foo = aop[item[0]];
          switch (item[1]) {
            case 'render':
              param.render = foo(param.render, item[2]);
              break;
            case 'bindEvent':
              param.componentDidMount = foo(param.componentDidMount, item[2]);
              break;
            default:
              break;
          }
        });
      }
      res = React.createClass(param);
    })();
  }
  res.__Origin__ = Origin; // eslint-disable-line
  return res;
};

/**
 * for now, it just one way to print
 */
var print = function print(container, element) {
  ReactDom.render(element, container);
};

var resolve$1 = function resolve$1(config) {
  // just push resolve config
  resolves.push(config);
};

function Seed() {
  // prepare some context
  if (this.prepare) this.prepare();
}
// state, props, children
Seed.prototype.render = function render(state, props, children) {
  return this.tpl(state, props, children);
};
// component mount
Seed.prototype.init = function init(element) {
  this.element = element;
};

var create = function create(name, prototype, staticProps, Super) {
  var Child = get$1(name);
  if (Child == null) {
    /* eslint-disable */
    Super = Super ? Super.__Origin__ : Seed;
    var constructorName = name.split('-').map(function (v) {
      return '' + v.charAt(0).toUpperCase() + v.substring(1);
    }).join('');
    var Origin = new Function('Super', 'return function ' + constructorName + '() {\n  Super.call(this)\n}')(Super);
    inherit(Origin, Super);
    Object.assign(Origin, Super, staticProps);
    if (prototype) Object.assign(Origin.prototype, prototype);
    // mark name
    Origin.__name__ = name;
    /* eslint-enable */
    // transform Origin to the real Element
    Child = transform(Origin);
    set(name, Child);
  } else {
    throw new Error('You should not redefined ' + name);
  }
  return Child;
};

var get$$1 = get$1;

var index = { createElement: createElement };

var render$1 = function render$1(container, Element, props) {
  var element = createElement(Element, props);
  print(container, element);
};

var resolve$$1 = function resolve$$1(config) {
  resolve$1(config);
  if (typeof config.match === 'string') create(config.match);
};

exports.create = create;
exports.get = get$$1;
exports['default'] = index;
exports.render = render$1;
exports.resolve = resolve$$1;

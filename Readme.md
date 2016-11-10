# mould.js

### 简介

> mould.js 主要为了解决不同标准元件在同一个平台公用的问题，并提供相应可方便对接的标准接口，让不同标准的元件可用类似的方法接入。

### 分层

##### UI结构树

> 用来描述 UI 编排的结构，本质上是一个对象树，可用各种方案生成

```ts
declare class Element {
  tagname: String, // 标签名
  content?: String, // 当 tagname 为 text 时的内容
  children: Array<Element>, // 子元素
  props: Object, // 属性
  key?: String | Number // key，类同 React 的 key
}
```

已知有几种可能性来生成 UI 结构树：

* 手写
* JSX
* 通常模板（实现具体参考 [artery-loader](https://github.com/miniflycn/artery-loader) ）

##### Origin

> Origin 用以储存原元件的状态，方法等，可以当是一个桩，用于后面的过程

mould.js 提供了 create 方法方便创建 Origin 并将其转成对应的 Component，目前 Componennt 即 React Componennt，但从实现来讲可以替换成 Vue Component 等

```js
import { create } from 'mould.js'

/**
 * @return Class extends Super
 */
create('my-component', { /* prototype */ }, { /* static properties */ }, /* Super Class, default is Seed */)
```

##### Seed

目前 Seed 源码如下，可以窥见其目前只有两个基本能力：

* prepare 创建后做一些准备
* render 渲染

```js
function Seed() {
  // prepare some context
  if (this.prepare) this.prepare()
}
// state, props, children
Seed.prototype.render = function render(state, props, children) {
  return this.tpl(state, props, children)
}

export default Seed
```

所有 Origin 应为 Seed 的子孙类型

##### transform & createElement

对任何 tagname，我们都有对应的两个阶段：

* transform(将 Origin 转成 Component)
* createElement（将 Component 在目前底层体系生成实例，例如在 React 体系等同于调用 React.createElement）

默认状态下，transform 会将 UI 结构树转成 Component，但我们可以通过自定义路由的方式来让不同的 tagname 以不同的方式展示

##### resolve

resolve 是用来定义在不同条件下的 transform 和 createElement 过程的。

```ts
Interface ResolveConfig {
  match: String | RegExp | Function, // 匹配规则
  transform: (O: Origin) => C: Componennt, // 将对应 Origin 转成 Componennt 的方法
  createElement: (C: Componennt, props: Object, ...children: Array<Component>) => element: Element // 将 Component 生成 Element 实例的方法
}

resolve(resolveConfig: ResolveConfig)
```

### 例子

##### 启动例子

> npm install
> npm install webpack-dev-server -g
> webpack-dev-server

* json.html - 结构树生成 Component
* default.html - 默认的 Component 引用
* react.html - 使用 React 组件的例子
* third.html - 使用第三方组件(例如jQuery)的例子
* plugin.html - 可扩展成插件机制演示
* flux.html - 和 flux 结合的例子，可以做到根据不同路由对不同组件体系对接 flux

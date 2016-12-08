const nodeResolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')

module.exports = {
  entry: './lib/index.js',
  dest: './index.js',
  format: 'cjs',
  external: ['react', 'react-dom', 'xtend', 'xtend/mutable'],
  plugins: [
    nodeResolve({
      skip: ['react', 'react-dom', 'xtend'],
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}

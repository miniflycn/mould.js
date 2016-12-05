const nodeResolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')

module.exports = {
  entry: './lib/index.js',
  dest: './index.js',
  format: 'cjs',
  external: ['react', 'react-dom'],
  plugins: [
    nodeResolve({
      skip: ['react', 'react-dom'],
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}

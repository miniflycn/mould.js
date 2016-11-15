const nodeResolve = require('rollup-plugin-node-resolve')

module.exports = {
  entry: './lib/index.js',
  dest: './index.js',
  format: 'cjs',
  external: ['react', 'react-dom'],
  plugins: [
    nodeResolve({
      skip: ['react', 'react-dom'],
    }),
  ],
}

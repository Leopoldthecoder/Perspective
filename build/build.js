var rollup = require('rollup')
var buble = require('rollup-plugin-buble')
var commonjs = require('rollup-plugin-commonjs')
var eslint = require('rollup-plugin-eslint')
var nodeResolve = require('rollup-plugin-node-resolve')
var uglify = require('rollup-plugin-uglify')

var build = function (opts) {
  rollup.rollup({
    entry: opts.entry,
    plugins: opts.plugins
  }).then(function (bundle) {
    bundle.write({
      format: opts.format,
      moduleName: 'perspective',
      dest: opts.output
    })
  }).catch(function (err) {
    console.error(err)
  })
}

build({
  entry: 'src/index.js',
  output: 'lib/perspective.common.js',
  format: 'cjs',
  plugins: [eslint(), buble(), commonjs(), nodeResolve(), uglify()]
})

build({
  entry: 'src/index.js',
  output: 'lib/perspective.js',
  format: 'umd',
  plugins: [eslint(), buble(), commonjs(), nodeResolve(), uglify()]
})

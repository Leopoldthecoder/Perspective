var rollup = require('rollup')
var buble = require('rollup-plugin-buble')
var json = require('rollup-plugin-json')
var commonjs = require('rollup-plugin-commonjs')
var eslint = require('rollup-plugin-eslint')
var nodeResolve = require('rollup-plugin-node-resolve')
var uglify = require('rollup-plugin-uglify')

var build = function (opts) {
  rollup.rollup({
    entry: opts.entry,
    plugins: [eslint(), json(), buble(), commonjs(), nodeResolve(), uglify()]
  }).then(function (bundle) {
    bundle.write({
      format: 'cjs',
      dest: opts.output
    })
  }).catch(function (err) {
    console.error(err)
  })
}

build({
  entry: 'docs/examples/demo.js',
  output: 'docs/examples/demo.min.js'
})

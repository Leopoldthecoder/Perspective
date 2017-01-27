var rollup = require('rollup')
var buble = require('rollup-plugin-buble')
var commonjs = require('rollup-plugin-commonjs')
var eslint = require('rollup-plugin-eslint')
var nodeResolve = require('rollup-plugin-node-resolve')
var uglify = require('rollup-plugin-uglify')

var build = function (opts) {
  rollup.rollup({
    entry: opts.entry,
    plugins: [buble()].concat(opts.plugins || [])
  }).then(function (bundle) {
    bundle.write({
      format: 'cjs',
      moduleName: 'perspective.js',
      dest: opts.output
    })
  }).catch(function (err) {
    console.error(err)
  })
}

build({
  entry: 'src/index.js',
  output: 'lib/perspective.min.js',
  plugins: [eslint(), commonjs(), nodeResolve(), uglify()]
})

import buble from 'rollup-plugin-buble'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import eslint from 'rollup-plugin-eslint'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'example/demo.js',
  format: 'cjs',
  plugins: [eslint(), json(), buble(), commonjs(), nodeResolve()]
}

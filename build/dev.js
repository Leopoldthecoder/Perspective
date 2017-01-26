import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import eslint from 'rollup-plugin-eslint'
import nodeResolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'perspective.js',
  format: 'cjs',
  plugins: [eslint(), buble(), commonjs(), nodeResolve(), uglify()]
}

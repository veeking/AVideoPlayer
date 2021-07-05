// import merge from 'deepmerge'
// import { fileURLToPath } from 'url'
import merge from 'deepmerge'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import glslify from 'rollup-plugin-glslify'
import pkg from './package.json'
import filesize from 'rollup-plugin-filesize'
const isProd = process.env.NODE_ENV === 'production'

const baseOutputConfig = {
  name: 'AVideoPlayer',
  file: './lib/alpha-video-player.js',
  format: 'umd',
  sourcemap: false,
  compact: true,
  exports: 'default'
}
export default {
  input: './src/player.js',
  output: [
    merge(baseOutputConfig, { file: pkg.browser, format: 'umd' }),
    merge(baseOutputConfig, { file: pkg.main, format: 'cjs' }),
    merge(baseOutputConfig, { file: pkg.module, format: 'esm' })
  ],
  plugins: [
    resolve(), // 识别import依赖  import支持
    commonjs(), // 支持commonjs引入
    babel({
      exclude: 'node_modules/**', // 排除 node_modules 中库代码
      babelHelpers: 'runtime' // 配置runtime
    }),
    filesize(),
    glslify(), // 支持glsl文件引入
    replace({ //  === 定于全局变量 等同于webpackDefine
      preventAssignment: true, // 开启后保留===号相关字符
      values: {
        'process.env.NODE_ENV': process.env.NODE_ENV || 'development'
      }
    }),
    isProd && terser() // 生产环境混淆压缩
  ]
}

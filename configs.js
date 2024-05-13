import path from 'path';

import alias from '@rollup/plugin-alias'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import eslint from '@rollup/plugin-eslint'
import babel from 'rollup-plugin-babel'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

import imageminSharp from 'imagemin-sharp' // imagemin-svgo 병목
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngcrush from 'imagemin-pngcrush'
import imageminPngquant from 'imagemin-pngquant'
import imageminZopfli from 'imagemin-zopfli'
import imageminSvgo from 'imagemin-svgo'

import aliasImporter from 'node-sass-alias-importer'

import pkg from './package.json'

const exclude = [ 'node_modules/**' ]

const configs = {
  name: pkg.name,
  root: 'src',
  dest: 'dist',
  // formats: ['iife', 'es', 'amd', 'cjs'],
  formats: [ 'iife' ],
  default: 'iife',
  minify: (process.env.NODE_ENV === 'production'),
  sourceMap: (process.env.NODE_ENV !== 'production'),
  port: {
    dev: 10222
  }
}

configs.js = {
  chunk: [ 'ui-vendor.js', 'ui-polyfill.js' ],
  src: `${ configs.root }/resource/js`,
  dest: `${ configs.dest }/resource/js`
}

configs.html = {
  nunjucks: {
    'config': 'nunjucks.config.js',
    'dest': configs.dest,
    'ext': '.html',
    'baseDir': configs.root,
    'cwd': process.cwd(),
    'flatten': false,
  },
  format: {
    indent_size: 2, // 들여쓰기 크기 [4]
    indent_char: ' ', // 들여쓰기 문자 [' ']
    end_with_newline: false, // 마지막에 새로운 줄 시작
    preserve_newlines: false, // 기존 줄바꿈 유지
    indent_inner_html: false, // <head> 및 <body> 섹션을 들여씀
    indent_empty_lines: false, // 빈라인을 유지할지 여부
  },
  relativePath: true // 상대경로 변환 여부
}

configs.css = {
  chunk: [ '/resource/scss/app.scss' ],
  src: `${ configs.root }/resource/scss`,
  dest: `${ configs.dest }/resource/scss`,
  sourceMap: configs.sourceMap,
  sourceMapContents: configs.sourceMap,
  indentType: 'space',
  indentWidth: 2,
  // outputStyle: configs.minify ? 'compressed' : 'expanded',
  outputStyle: 'compressed',
}

configs.img = {
  type: '/**/*.{jpg,jpeg,png,gif,svg}',
  src: `${configs.root}/resource/image`,
  dest: `${configs.dest}/resource/image`
}

const plugins = {
  js: [
    alias( {
      entries: [
        { find: '@', replacement: path.resolve( __dirname, configs.root ) }
      ]
    } ),
    nodeResolve( {
      // use 'jsnext:main' if possible
      // see https://github.com/rollup/rollup/wiki/jsnext:main
      jsnext: true,
      browser: true
    } ),
    commonjs(),
    eslint( {
      exclude
    } ),
    babel( {
      exclude
    } ),
    json()
  ],

  img: [
    imageminSvgo( {
      plugins: [ {
        name: 'removeViewBox',
        active: true
      } ]
    } ),
    // imageminSharp(),
    // imageminWebp({ quality: 80 }),
    imageminMozjpeg(),
    imageminPngcrush(),
    imageminPngquant(),
    imageminZopfli(),
  ],

  scss: {
    importer: [
      aliasImporter( {
        '@': './src/resource/scss',
        'common': './src/resource/scss/common',
        'define': './src/resource/scss/define',
        'layout': './src/resource/scss/layout',
        'vendor': './src/resource/scss/vendor'
      } )
    ],
  }

}

if ( process.env.NODE_ENV === 'production' ) {

  if ( configs.minify ) {
    plugins.js.push( terser() )
  }

}

export { configs, plugins, exclude }
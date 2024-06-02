import sass from 'sass'
import fs from 'fs/promises'
import globby from 'globby'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import postcssReporter from "postcss-reporter"
import { configs, plugins } from '../configs'

let argv = process.argv.slice( 2 )
let isWatch = !!argv.length

// watch 대상파일
let files = [ argv[0] ]
let event = [ argv[1] ] // add, unlink

function compatiblePath( str ) {
  return str.replace( /\\/g, '/' )
}

async function workPostCss( css, pathOut, fileName, prevMap ) {
  let result = await postcss( [
    autoprefixer,
    postcssReporter( { clearReportedMessages: true } )
  ] ).process( css, {
    from: pathOut,
    map: prevMap ? { prev: prevMap, inline: false, annotation: false } : { inline: false, annotation: false }
  } )

  await writeFile( pathOut, fileName, result.css )

  if ( result.map && configs.sourceMap ) {
    await writeFile( pathOut, fileName + '.map', result.map.toString() )
  }
}

async function writeFile( pathOut, fileName, fileData = true ) {
  await fs.mkdir( pathOut, { recursive: true } )
  await fs.writeFile( `${ pathOut }${ fileName }`, fileData )
  console.log( `[Scss 컴파일] ${ pathOut }${ fileName }` )
}

async function parseSass( srcFiles ) {
  let promises = srcFiles.map( async srcFile => {
    const outFile = compatiblePath( srcFile )
      .replace( /^src/g, configs.dest )
      .replace( /\/scss\//g, '/css/' )
      .replace( /.scss$/g, '.css' )

    const outFileName = outFile.match( /[^/]+$/ )[0]
    const outFilePath = outFile.match( /^(.*\/)[^/]+$/ )[1]

    try {
      let result = await sass.renderSync( {
        file: srcFile,
        outFile: outFile,
        importer: plugins.scss.importer,
        ...configs.css
      } )

      await workPostCss( result.css.toString(), outFilePath, outFileName, (result.map) && result.map.toString() )
    } catch ( err ) {
      console.error( err.message )
    }
  } )

  await Promise.all( promises )
}

if ( isWatch ) {
  console.log( `[css 감지]`, files, event )

  if ( event == 'unlink' ) {
    process.exit( 1 )
  }

  // 파일명이 '_' 인 경우
  if ( /_[^\/]*?\.*$/.test( files[0] ) ) {
    files = configs.css.chunk.map( file => `${ configs.root }${ file }` )
    console.log( `>> '_' 파일은 import 대상으로, 컴파일 제외, chunk 컴파일\n${ files }` )
  }

  parseSass( files )

} else {
  globby( `${ configs.css.src }/**/!(_*).scss` ).then( files => {
    parseSass( files )
  } )
}
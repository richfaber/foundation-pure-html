import sass from 'sass'

import fs from 'fs'
import globby from 'globby'

import { configs, plugins } from '../configs'

let argv = process.argv.slice( 2 )
let isWatch = !!argv.length

// watch 대상파일
let files = [ argv[0] ]
let event = [ argv[1] ] // add, unlink

function compatiblePath( str ) {
  return str.replace( /\\/g, '/' )
}


function writeFile( pathOut, fileName, fileData = true ) {
  // Create the directory path
  fs.mkdir( pathOut, { recursive: true }, function ( err ) {
    // If there's an error, throw it
    if ( err ) throw err;

    // Write the file to the path
    fs.writeFile( `${ pathOut }${ fileName }`, fileData, function ( err ) {
      if ( err ) throw err;

      const data = fs.readFileSync( `${ pathOut }${ fileName }` );
      const fd = fs.openSync( `${ pathOut }${ fileName }`, 'w+' );
      fs.writeSync( fd, data, 0, data.length, 0 );
      fs.close( fd, function ( err ) {
        if ( err ) throw err;
        console.log( `[Scss 컴파일] ${ pathOut }${ fileName }` );
      } )
    } )
  } )
}

function parseSass( srcFiles ) {

  srcFiles.forEach( srcFile => {

    const outFile = compatiblePath(srcFile)
      .replace( /^src/g, configs.dest )
      .replace( /\/scss\//g, '/css/' )
      .replace( /.scss$/g, '.css' )

    const outFileName = outFile.match(/[^/]+$/)[0]
    const outFilePath = outFile.match(/^(.*\/)[^/]+$/)[1]

    sass.render( {
      file: srcFile,
      outFile: outFile,
      importer: plugins.scss.importer,
      ...configs.css
    }, function ( err, result ) {

      if ( err ) throw err;

      writeFile( outFilePath, outFileName, result.css );

      if ( configs.sourceMap ) {
        writeFile( outFilePath, outFileName + '.map', result.map, false );
      }
    } )

  } )

}

if ( isWatch ) {
  console.log( `[css 감지]`, files, event )

  if ( event == 'unlink' ) {
    process.exit( 1 )
  }

  // 파일명이 '_' 인 경우
  if ( /_[^\/]*?\.*$/.test(files[0]) ) {
    files = configs.css.chunk
    console.log(`>> '_' 파일은 import 대상으로, 컴파일 제외`)
  }

  parseSass( files.map(file => `${ configs.root }${file}`) )

} else {

  globby( `${ configs.css.src }/**/!(_*).scss`, {} ).then( files => {
    parseSass( files )
  })

}
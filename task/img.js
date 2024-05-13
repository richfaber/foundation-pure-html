import imagemin from 'imagemin';
import globby from 'globby';
import path from 'path';

import { configs, plugins } from '../configs'

globby( configs.img.src + configs.img.type, { nodir: true } ).then( filePaths => {
  filePaths.forEach( filePath => {
    const fileDir = path.dirname( filePath );
    doCompress( filePath, fileDir.replace( configs.img.src, configs.img.dest ) );
  } )
} );

function doCompress( srcFile, outDir ) {

  imagemin( [ srcFile ], {
    destination: outDir,
    plugins: plugins.img
  } ).then( ( files ) => {

    console.log( `[이미지압축] ${ srcFile } -> ${ files[0].destinationPath }` )

  } ).catch( err => {

    console.log( `[이미지압축 error]: ${ err }` )

  } )

}
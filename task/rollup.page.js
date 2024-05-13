import glob from 'glob';
import { configs, plugins } from '../configs'

// watch 대상파일
let files = [ process.argv[4] ]

function createExport() {

  if ( !files[0] ) {
    files = glob.sync( `${configs.js.src}/**/*.js` )
  }

  return files.map( ( file ) => {

    const output = {
      input: file,
      output: [
        {
          file: file.replace(/\\/g, '/').replace( configs.js.src, configs.js.dest ),
          format: configs.default,
          sourcemap: configs.sourceMap
        }
      ],
      plugins: plugins.js
    }

    return output;
  } );
}

export default createExport();
import pkg from '../package.json'
import { configs, plugins } from '../configs'

const createOutput = function ( filename, minify ) {
  return configs.formats.map( function ( format ) {
    const output = {
      // file: `${configs.configs.dest }/resource/js/${filename}${format === configs.default ? '' : `.${format}`}${minify ? '.min' : ''}.js`,
      file: `${ configs.js.src.replace(configs.root, configs.dest) }/${ filename }${ format === configs.default ? '' : `.${ format }` }.js`,
      format: format,
      sourcemap: configs.sourceMap
    };

    if ( format === 'iife' ) {
      output.name = configs.name ? configs.name : pkg.name;
    }

    return output;
  } );
};

/**
 * Create export object
 * @return {Array} The export object
 */
const createExport = function ( file ) {

  // Core 번들파일
  const files = configs.js.chunk.map( function ( file ) {
    const filename = file.replace( '.js', '' );
    return {
      input: `${ configs.js.src }/${ file }`,
      output: createOutput( filename ),
      plugins: plugins.js
    };
  } );

  return files
};

export default createExport();

const pkg = require('../package.json');
const { configs, plugins } = require('../configs');

const createOutput = function(filename, minify) {
  return configs.formats.map(function(format) {
    const output = {
      file: `${configs.js.src.replace(configs.root, configs.dest)}/${filename}${format === configs.default ? '' : `.${format}`}.js`,
      format: format,
      sourcemap: configs.sourceMap
    };

    if (format === 'iife') {
      output.name = configs.name ? configs.name : pkg.name;
    }

    return output;
  });
};

/**
 * Create export object
 * @return {Array} The export object
 */
const createExport = function(file) {
  // Core 번들파일
  const files = configs.js.chunk.map(function(file) {
    const filename = file.replace('.js', '');
    return {
      input: `${configs.js.src}/${file}`,
      output: createOutput(filename),
      plugins: plugins.js
    };
  });

  return files;
};

module.exports = createExport();

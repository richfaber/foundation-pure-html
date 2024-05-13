import browserSync from 'browser-sync'

import { configs } from '../configs'

browserSync({
  port: configs.port.dev,
  // reloadDelay: 1000,
  files: [{
    match: ["./dist/**"],
    fn: function (event, file) {
      this.reload()
    }
  }],
  server: "./dist",
  browser: ["iexplore"],
  watch: true
});

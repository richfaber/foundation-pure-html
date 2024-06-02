import browserSync from 'browser-sync'

import { configs } from '../configs'

browserSync({
  port: configs.port.dev,
  reloadDelay: 500, // 리로드 지연 시간을 조정
  reloadDebounce: 500, // 여러 변경 사항을 한 번에 리로드
  files: [{
    match: ["./dist/**/*.{html,css,js}"], // 필요한 파일 유형만 감지하도록 패턴을 조정합니다.
    fn: function (event, file) {
      this.reload()
    }
  }],
  server: "./dist",
  browser: ["iexplore"],
  watch: true,
  watchOptions: {
    ignoreInitial: true, // 초기 실행 시 파일 변경 감지를 무시합니다.
    ignored: '*.txt', // 감지에서 제외할 파일 패턴을 설정합니다.
    usePolling: true, // 폴링을 사용하여 파일 변경을 감지합니다.
  }
});
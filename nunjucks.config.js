const dotenv = require('dotenv')
const pkg = require('./package.json')

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' })
} else {
  dotenv.config({ path: '.env.local' })
}

// https://mozilla.github.io/nunjucks/api.html#configure
module.exports = {
  "options": {
    /**
     * 템플릿에 대한 데이터를 포함하는 파일 경로입니다.
     * 객체를 전달하고 싶다면, 대신 "render.context"를 사용하세요.
     */
    // "data": "some/path/on/cwd.js",
    /**
     * nunjucks.render()를 호출하기 전, 그러나 nunjucks.configure() 후에 호출되는 훅입니다.
     *
     * 렌더링(과 파일 쓰기)을 건너뛰려면 false를 반환하세요.
     */
    beforeRender (nunjucksEnv, renderName, renderData) {
      let nunjucks = this;

      const currentDate = new Date();
      const dateStr = {
        year: currentDate.getFullYear(),
        month: (currentDate.getMonth() < 10) ? "0" + currentDate.getMonth() : currentDate.getMonth(),
        day: (currentDate.getDate() < 10) ? "0" + currentDate.getDate() : currentDate.getDate(),
        hour: (currentDate.getHours() < 10) ? "0" + currentDate.getHours() : currentDate.getHours(),
        time: (currentDate.getMinutes() < 10) ? "0" + currentDate.getMinutes() : currentDate.getMinutes()
      }

      nunjucksEnv.addGlobal('사용자환경', process.env.authorUserEnv);
      nunjucksEnv.addGlobal('버전', pkg.version);
      // nunjucksEnv.addGlobal('Host', process.env.HOST);

      nunjucksEnv.addGlobal('현재시간', `${dateStr.year}-${dateStr.month}-${dateStr.day} ${dateStr.hour}:${dateStr.time}`);

    },
    /**
     * nunjucks.render() 호출 후, 파일에 쓰기 전에 호출되는 훅입니다.
     *
     * 쓰기를 건너뛰려면 false를 반환하세요.
     */
    beforeWrite (destinationFilepath, renderResult) {
      let nunjucks = this;
    }
  },

  /**
   * 다음 키들은 Nunjucks의 멤버입니다.
   * 어떤 매개변수를 수정하거나 가능한 값을 보려면,
   * https://mozilla.github.io/nunjucks/api.html을 확인해주세요.
   */

  // nunjucks.configure([경로], [옵션])을 실행합니다.
  "configure": {
    "path": 'src',
    "options": {
      "autoescape": true,
      "throwOnUndefined": false,
      "trimBlocks": true,
      "lstripBlocks": true
    }
  },

  // nunjucks.render(이름, [컨텍스트], [콜백])을 실행합니다.
  "render": {
    "name": undefined, // 이건 변경하면 안됩니다.
    /**
     * 템플릿에 대한 데이터를 포함하는 객체 리터럴입니다.
     * 파일에서 데이터를 로드해야 한다면, 대신 "options.data"를 사용하세요.
     * "options.data"를 사용하기로 결정했다면, 이 속성은 그것에 할당될 것입니다.
     */
    "context": {},
    "callback": () => {} // 수정할 수 없습니다.
  }

};

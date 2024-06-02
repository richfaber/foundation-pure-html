const nunjucksToHtml = require('nunjucks-to-html');
const globby = require('globby');
const fs = require('fs/promises');
const path = require('path');

const { html: beautify } = require('js-beautify');
const { configs } = require('../configs');

let argv = process.argv.slice(2);

// watch 대상파일
let files = [argv[0]];
let event = [argv[1]]; // add, unlink

const isWatch = !!argv.length;

// 컴파일 제외 대상파일
const isIgnore = isWatch && !/^src[\/\\]layout/.test(files[0]) || /^src[\/\\]import/.test(files[0]);
const isSubmodule = (process.env.GIT_ENV === 'submodule');


function compatiblePath(str) {
  return str.replace(/\\/g, '/');
}

function convertSrcToRelativePath(htmlContent, currentFilePath) {
  // 정규 표현식 수정: 단일 인용부호를 포함한 부분을 제거하고, src와 href 속성 값만 매칭하도록 함
  htmlContent = htmlContent.replace(/\s(src|href)=["'](.*?)["']/g, (match, p1, p2) => {
    // src 또는 href 의 경로
    const srcPath = p2;

    // src 경로가 없거나, 웹서버 자원이면 변경하지 않음
    if (!srcPath || /^https:|http:/g.test(srcPath)) return match;

    let relativeSrcPath = path.relative(path.dirname(currentFilePath), configs.dest).replace(/\\/g, '/');
    let resourcePath = (srcPath.startsWith('/')) ? srcPath.substring(1) : srcPath; // 절대 경로일 경우 맨 앞 '/' 제거
    let type = p1; // p1은 'src' 또는 'href' 경로

    return ` ${type}="${relativeSrcPath}/${resourcePath}"`;
  });

  return htmlContent;
}

function compileHtml() {
  return nunjucksToHtml(files, configs.html.nunjucks)
    .then(() => {
      const tasks = files.map(file => {
        const filePath = `${configs.dest}/${file}`.replace('.njk', '.html');
        return fs.readFile(filePath, 'utf8')
          .then(htmlContent => {
            htmlContent = beautify(htmlContent, configs.html.format);
            if (configs.html.relativePath) htmlContent = convertSrcToRelativePath(htmlContent, filePath);
            // @TODO: body 내용 중, 태그 안에 있는 HTML 특수문자 처리 필요
            return fs.writeFile(filePath, htmlContent, 'utf8');
          })
          .then(() => {
            console.log('[html 컴파일]', filePath);
          })
          .catch(error => {
            console.error(`파일 처리 중 오류가 발생했습니다: ${error}`);
          });
      });
      return Promise.all(tasks);
    })
    .catch(error => {
      console.error('error ->\n', error);
    });
}

// 감지상태 이고, 컴파일 대상이 아닌 경우
if (isWatch && isIgnore) {
  console.log('[html 감지]', files, event);
  if (event == 'unlink') {
    process.exit(1);
  }
  files[0] = compatiblePath(files[0]).replace('src/', '');
  compileHtml();
} else {
  globby([`${configs.root}/**/*.njk`, `!${configs.root}/layout/**`, `!${configs.root}/import/**`])
    .then(filePaths => {
      files = filePaths.map(filePath => filePath.replace('src/', ''));
      return compileHtml();
    });
}
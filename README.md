# html + nunjucks + scss + es6 조합 페이지 빌드 환경

## 구성

- nunjucks 로 html 구조화 하고, build 후에 html 을 생성함.
- rollup 으로 js 를 생성함.
- sass, postcss 로 css 를 생성함.
- imagemin 으로 image 를 생성함.

## 사전 설치

- [Install Node.js.](http://nodejs.org/)

## 설치

```terminal
$> npm install
```

## 명령어

```terminal
$> npm run server // 로컬서버 구동
$> npm run build // 자원 빌드
```

## 컴포넌트와 페이지를 분리해서 하는 경우 

- [컴포넌트](https://github.com/richfaber/foundation-pure-html-component) 
- [페이지](https://github.com/richfaber/foundation-pure-html-page) 

## 스크립트

### clean

dist 폴더 내의 모든 파일과 폴더를 삭제합니다.

### js-chunk

rollup을 사용해 자바스크립트 청크 파일을 번들링합니다.

### js-page

rollup을 사용해 페이지별 자바스크립트 파일을 번들링합니다.

### css

babel-node를 사용해 CSS 파일을 처리합니다.

### img

babel-node를 사용해 이미지 파일을 최적화합니다.

### html
babel-node를 사용해 HTML 파일을 생성합니다.

### html-lint
html-validate를 사용해 dist 폴더 내의 모든 HTML 파일을 검사합니다.

### build:dirty
병렬로 js-chunk, js-page, css, img, html 스크립트를 실행합니다.

### build
clean 스크립트를 실행한 후, build:dirty와 html-lint를 순차적으로 실행합니다.

### watch:css
SCSS 파일의 변경을 감지하고 변경 시 css 스크립트를 실행합니다.

### watch:js-chunk
자바스크립트 청크 파일의 변경을 감지하고 변경 시 js-chunk 스크립트를 실행합니다.

### watch:js-page
페이지별 자바스크립트 파일의 변경을 감지하고 변경 시 js-page 스크립트를 실행합니다.

### watch:img
이미지 파일의 변경을 감지하고 변경 시 img 스크립트를 실행합니다.

### watch:html
Nunjucks 파일의 변경을 감지하고 변경 시 html 스크립트를 실행합니다.

### watch:html-lint
HTML 파일의 변경을 감지하고 변경 시 html-lint를 실행합니다.

### watch
모든 watch:* 스크립트를 병렬로 실행합니다.

### server:start
개발 서버를 시작합니다.

### server
clean, build:dirty, server:start, watch 스크립트를 순차적으로 실행합니다.



[//]: # (## 서브모듈 등록)

[//]: # ()
[//]: # (- 현재 저장소에서, 서브모듈을 등록한다.)

[//]: # ()
[//]: # (```terminal)

[//]: # (// git submodule add <저장소URL> <저장될 폴더이름>)

[//]: # ($> git submodule add https://github.com/richfaber/foundation-pure-html component)

[//]: # (```)


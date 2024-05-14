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



[//]: # (## 서브모듈 등록)

[//]: # ()
[//]: # (- 현재 저장소에서, 서브모듈을 등록한다.)

[//]: # ()
[//]: # (```terminal)

[//]: # (// git submodule add <저장소URL> <저장될 폴더이름>)

[//]: # ($> git submodule add https://github.com/richfaber/foundation-pure-html component)

[//]: # (```)


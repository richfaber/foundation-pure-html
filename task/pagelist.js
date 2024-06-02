import fs from 'fs'
import path from 'path'
import HTMLParser from 'node-html-parser'
import { html as beautify } from 'js-beautify'

// HTML 파일들이 위치한 루트 디렉토리
const rootDirectory = path.resolve(__dirname, '../dist');

// 생성할 JSON 파일 경로
const listPath = path.resolve(__dirname, '../dist/pageList.html');

// HTML 파일 목록을 저장할 배열
let htmlFiles = [];

// 디렉토리 및 서브디렉토리를 재귀적으로 탐색하는 함수
function readHtmlFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      readHtmlFiles(filePath); // 서브디렉토리를 재귀적으로 탐색
    } else if (path.extname(file) === '.html') {
      const relativePath = path.relative(rootDirectory, filePath);
      htmlFiles.push(relativePath);
    }
  });

}

// HTML 파일 목록 읽기 시작
readHtmlFiles(rootDirectory);

// 파일 정보 배열 생성
let fileInfoList = [];

htmlFiles.forEach(file => {
  const filePath = path.join(rootDirectory, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const root = HTMLParser.parse(content);
  const title = root.querySelector('title') ? root.querySelector('title').text : 'No Title';

  fileInfoList.push({
    path: file,
    title: title
  });
});

// 링크 목록 생성
let linkList = '<table>\n';
fileInfoList.forEach(fileInfo => {
  linkList += `<tr>\n`;
  linkList += `<td><a href="${fileInfo.path}">${fileInfo.title}</a></td>\n`;
  linkList += `<td><a href="${fileInfo.path}">${fileInfo.title}</a></td>\n`;
  linkList += `</tr>\n`;
});
linkList += '</table>';

// list.html 파일 내용
const listHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML Files List</title>
</head>
<body>
    <h1>HTML Files List</h1>
    ${linkList}
</body>
</html>
`;

// list.html 파일 생성
fs.writeFileSync(listPath, beautify(listHtmlContent), 'utf8');
console.log('list.html 목록이 작성되었습니다.');
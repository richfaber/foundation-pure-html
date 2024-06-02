import fs from 'fs'
import path from 'path'
import HTMLParser from 'node-html-parser'
import { html as beautify } from 'js-beautify'
import puppeteer from 'puppeteer'

// HTML 파일들이 위치한 루트 디렉토리
const rootDirectory = path.resolve(__dirname, '../dist')

const pagelistDir = path.resolve(__dirname, '../dist/pagelist')
if (fs.existsSync(pagelistDir)) {
  fs.rmSync(pagelistDir, { recursive: true, force: true })
}

// 생성할 파일 경로
const listPath = path.resolve(__dirname, '../dist/pagelist/index.html')

// 썸네일 저장 디렉토리 생성
const thumbnailDir = path.resolve(__dirname, '../dist/pagelist/thumbnails')
if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true })
}

let htmlFiles = []

function readHtmlFiles(dir) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      readHtmlFiles(filePath)
    } else if (path.extname(file) === '.html') {
      const relativePath = path.relative(rootDirectory, filePath)
      htmlFiles.push(relativePath)
    }
  })
}

readHtmlFiles(rootDirectory)

let fileInfoList = []

const generateThumbnail = async (filePath, fileName) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle2' })

  // 중복 방지를 위해 파일명에 타임스탬프 추가
  const timestamp = Date.now()
  const thumbnailFileName = `${fileName}-${timestamp}.png`
  const thumbnailPath = path.join(thumbnailDir, thumbnailFileName)

  await page.screenshot({ path: thumbnailPath })
  await browser.close()
  return thumbnailPath
}

const processFiles = async () => {
  for (const file of htmlFiles) {
    const filePath = path.join(rootDirectory, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const root = HTMLParser.parse(content)
    const title = root.querySelector('title') ? root.querySelector('title').text : 'No Title'
    const fileName = path.basename(filePath, '.html')
    const thumbnailPath = await generateThumbnail(filePath, fileName)
    const relativeThumbnailPath = path.relative(rootDirectory, thumbnailPath)

    fileInfoList.push({
      fileName,
      title,
      path: file,
      thumbnail: relativeThumbnailPath
    })
  }
}

const createHtmlList = () => {
  let directoryMap = {}

  fileInfoList.forEach(fileInfo => {
    const dir = path.dirname(fileInfo.path)
    if (!directoryMap[dir]) {
      directoryMap[dir] = []
    }
    directoryMap[dir].push(fileInfo)
  })

  let linkList = ''

  Object.keys(directoryMap).forEach(directory => {
    linkList += `<h2 class="headline">Directory: ${directory}</h2>\n<table class="tb">\n`
    directoryMap[directory].forEach(fileInfo => {
      linkList += `<tr>\n`
      linkList += `<td width="100%" class="title"><a href="../${fileInfo.path}" target="_blank">${fileInfo.title}</a></td>\n`
      linkList += `<td class="pageId"><a href="../${fileInfo.path}" target="_blank">${fileInfo.fileName}</a></td>\n`
      linkList += `<td class="thumnail"><img src="thumbnails/${path.basename(fileInfo.thumbnail)}" alt="${fileInfo.title} thumbnail" /></td>\n`
      linkList += `</tr>\n`
    })
    linkList += '</table>\n'
  })

  const listHtmlContent = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HTML Files List</title>
        <style type="text/css">
          * {
            margin: 0;
            padding: 0;
            list-style: none;
            text-decoration: none;
          }
          
          h2.headline {
            margin: 30px 0 10px;
          }

          img {
            vertical-align: top;
          }
          
          .tb {
            width: 100%;
            border-collapse: collapse;
          }

          .tb tr:hover {
            background: lightsteelblue;
          }
          
          .tb td {
            padding: 5px 10px;
          }
          
          
          .tb .pageId {
            white-space: nowrap;
          }
          
          .tb .thumnail img {
            width: 80px;
          }
          
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            justify-content: center;
            align-items: center;
          }
        
          .overlay img {
            max-width: 95%;
            max-height: 95%;
          }
        </style>
    </head>
    <body>
      <h1>HTML Files List</h1>
      ${linkList}
      
      <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function () {
          const overlay = document.createElement('div')
          overlay.className = 'overlay'
          
          overlay.addEventListener('click', function () {
            overlay.style.display = 'none'
          })
          
          const img = document.createElement('img')
          overlay.appendChild(img)
          document.body.appendChild(overlay)
      
          document.querySelectorAll('.thumnail img').forEach(function (thumbnail) {
            thumbnail.addEventListener('click', function (e) {
              e.stopPropagation()
              img.src = thumbnail.src
              overlay.style.display = 'flex'
            })
          })
        })
      </script>
    </body>
    </html>
  `

  fs.writeFileSync(listPath, beautify(listHtmlContent), 'utf8')
  console.log('## 페이지 목록 작성')
}

processFiles().then(createHtmlList)

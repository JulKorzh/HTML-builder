const fs = require('fs');
const path = require('path');

const templHTML = path.resolve(__dirname, 'template.html');
const componentsFolder = path.resolve(__dirname, 'components');
const stylesFolder = path.resolve(__dirname, 'styles');
const assetsFolder = path.resolve(__dirname, 'assets');
const projectDist = path.resolve(__dirname, 'project-dist');
const outputHTML = path.resolve(projectDist, 'index.html');
const outputCSS = fs.createWriteStream(path.resolve(projectDist, 'style.css'));
const outputAssets = path.resolve(projectDist, 'assets');

//Создание папки project-dist
fs.mkdir(projectDist, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});

//Создание папки assets
fs.mkdir(outputAssets, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});

//Создание файла index.html
let dataTemplHTML;
fs.readFile(templHTML, (err, data) => {
  if (err) console.log(err);
  dataTemplHTML = data.toString();
  fs.readdir(componentsFolder, (err, files) => {
    if (err) console.log(err);

    files.forEach((file) => {
      const fileExtend = path.extname(file);
      //if (fileExtend === '.html') {
        const fileName = path.basename(file, '.html');
        const readableStream = fs.createReadStream(
          path.resolve(componentsFolder, file),
        );

        let fileData = '';
        readableStream.on('data', (chunk) => (fileData += chunk));
        readableStream.on('end', () => {
          //Замена шаблонов
          dataTemplHTML = dataTemplHTML.replace(`{{${fileName}}}`, fileData);
          fs.writeFile(outputHTML, dataTemplHTML, (err) => {
            if (err) console.log(err);
          });
        });
        readableStream.on('error', (error) =>
          console.log('Error', error.message),
        );
      //}
    });
  });
});

//Создание style.css
fs.readdir(stylesFolder, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);

  files
    .filter((v) => v.isFile())
    .forEach((file) => {
      const fileExtend = path.extname(file.name);
      if (fileExtend === '.css') {
        const readableStream = fs.createReadStream(
          path.resolve(stylesFolder, file.name),
        );

        let data = '';
        readableStream.on('data', (chunk) => (data += chunk));
        readableStream.on('end', () => {
          data += '\n';
          outputCSS.write(data);
        });
        readableStream.on('error', (error) =>
          console.log('Error', error.message),
        );
      }
    });
});

//Копирование assets

function copyAssets(folder, copyFolder) {
  fs.readdir(folder, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    files.forEach((file) => {
      const filePath = path.resolve(folder, file.name);
      const filePathCopy = path.resolve(copyFolder, file.name);

      if (file.isDirectory()) {
        fs.mkdir(
          path.resolve(copyFolder, file.name),
          { recursive: true },
          (err) => {
            if (err) {
              return console.error(err);
            }
          },
        );
        return copyAssets(filePath, filePathCopy);
      }
      fs.copyFile(filePath, filePathCopy, (err) => {
        if (err) console.log(err);
      });
    });
  });
}
copyAssets(assetsFolder, outputAssets);

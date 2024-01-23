const fs = require('fs');
const path = require('path');

const stylesFolder = path.resolve(__dirname, 'styles');
const bundleFile = path.resolve(__dirname, 'project-dist', 'bundle.css')
const output = fs.createWriteStream(bundleFile);

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
          output.write(data);
        });
        readableStream.on('error', (error) =>
          console.log('Error', error.message),
        );
      }
    });
});

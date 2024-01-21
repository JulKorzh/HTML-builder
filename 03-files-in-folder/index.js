const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'secret-folder');

fs.readdir(filePath, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  files
    .filter((v) => v.isFile())
    .forEach((file) => {
      const fileEextend = path.extname(file.name);
      const fileName = path.basename(file.name, fileEextend);

      fs.stat(path.resolve(filePath, file.name), (error, stats) => {
        if (error) console.log(error);

        console.log(
          `${fileName} - ${fileEextend.substring(1)} - ${stats.size}B`,
        );
      });
    });
});

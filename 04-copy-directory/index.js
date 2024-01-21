const fs = require('fs');
const path = require('path');

const folder = path.resolve(__dirname, 'files');
const copyFolder = path.resolve(__dirname, 'files-copy');

fs.mkdir(copyFolder, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});

fs.readdir(folder, (err, files) => {
  if (err) console.log(err);
  files.forEach((file) => {
    fs.copyFile(
      path.resolve(folder, file),
      path.resolve(copyFolder, file),
      (err) => {
        if (err) console.log(err);
      },
    );
  });
  
  fs.readdir(copyFolder, (err, filesInCopy) => {
    if (err) console.log(err);
    const deleteFiles = filesInCopy.filter(v => files.includes(v) === false)
    deleteFiles.forEach((v) => {
      fs.unlink(path.resolve(copyFolder, v), (err) => {
        if (err) console.log(err);
      })
    })
  })

  console.log('Copying completed')
});

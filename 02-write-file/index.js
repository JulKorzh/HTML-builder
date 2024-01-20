const readline = require('readline');
const fs = require("fs");
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, '02-write-file.txt'));
const rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt(`Write your text:\n`);
rl.prompt();
rl.on('line', (input) => {
  if(input === 'exit') {
    rl.close()
  }
  output.write(input + '\n')
});
rl.on('close', () => console.log('Good bye!'));

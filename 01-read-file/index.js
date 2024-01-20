const path = require('path');
const fs = require('fs');

const pathTextFile = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(pathTextFile, 'utf-8');

let data = '';

readableStream.on('data', (chunk) => (data += chunk));
readableStream.on('end', () => console.log('End', data));
readableStream.on('error', (error) => console.log('Error', error.message));

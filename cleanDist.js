const fs = require('fs')
fs.rmdirSync(__dirname + '/dist', { recursive: true })
fs.mkdirSync(__dirname + '/dist', { recursive: true })
fs.mkdirSync(__dirname + '/dist/images', { recursive: true })
console.log('dist was removed')
// fs.rmdir('./dist')
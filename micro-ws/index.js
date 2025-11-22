// A very simply http server for hosting this app while also supporting a PUT /tasks.json request

const express = require('express');
const path = require('node:path');
const child_process = require('node:child_process');
const fs = require('node:fs');

const app = express();
const port = 4200;
const root = path.resolve(__dirname, '../dist/language-practice/browser');

const url = `http://localhost:${port}`;


app.use(express.static(root))

// Special upload route to save the current tasks to file
app.put('/tasks.json', (req, res) => {
  req.pipe(fs.createWriteStream(path.join(root, 'tasks.json')));
  req.on('end', () => { res.end(); });
});

app.listen(port, () => {
  console.log(`Webserver listening on ${url}`);
  console.log(`Serving files from: ${root}`);
  child_process.exec(`START ${url}`);
});
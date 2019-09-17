const { spawn } = require('child_process');
const fs = require('fs');
const tmp = require('tmp');

exports.run_javascript = (text) => {
  const path = tmp.tmpNameSync();
  fs.writeFile(path, text, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`File ${path} created.`);
  });
  return spawn('node', [path]);
};

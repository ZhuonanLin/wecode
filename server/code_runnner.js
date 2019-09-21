const { spawn } = require('child_process');
const fs = require('fs');
const tmp = require('tmp');

exports.run_code = (language, text) => {
  const path = tmp.tmpNameSync();
  fs.writeFile(path, text, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`File ${path} created.`);
  });

  if (language === 'javascript') {
    return spawn('node', [path]);
  } else if (language === 'python') {
    return spawn('python3', [path]);
  }
};

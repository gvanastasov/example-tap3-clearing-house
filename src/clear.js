const fs = require('fs');
const path = require('path');

const folder = path.join(__dirname, 'messages');

fs.readdir(folder, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(folder, file), (err) => {
      if (err) throw err;
    });
  }
  console.log('All files in the messages folder have been deleted.');
});
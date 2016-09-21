const glob = require("glob"),
      path = require('path');


glob(`${__dirname}/bot/**/*.js`, (err, files) => {
  files.forEach(file => {
    let module = path.relative(__dirname, file);
    require(`./${module}`);
  });
});


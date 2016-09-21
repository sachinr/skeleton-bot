const glob = require("glob"),
      path = require('path');


glob(`${__dirname}/bot/**/*.js`, (err, files) => {
  files.forEach(file => {
    let module = path.relative(__dirname, file);
    require(`./${module}`);
  });
});

var Botkit = require('botkit');

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var controller = Botkit.slackbot({
 debug: false
});

controller.spawn({
  token: process.env.token
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});


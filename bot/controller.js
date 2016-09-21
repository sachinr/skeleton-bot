var Botkit = require('botkit');
var os = require('os');

if (!process.env.clientId || !process.env.clientSecret || !process.env.port) {
  console.log('Error: Specify clientId clientSecret and port in environment');
  process.exit(1);
}

var controller = Botkit.slackbot({
  interactive_replies: true,
  json_file_store: './db_skeleton_bot/'
});

controller.configureSlackApp({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  scopes: ['bot']
});

controller.setupWebserver(process.env.port, (err,webserver) => {
  controller.createWebhookEndpoints(controller.webserver);
  controller.createOauthEndpoints(controller.webserver, oauthCallback);
});

function oauthCallback(err,req,res) {
  if (err) {
    res.status(500).send('ERROR: ' + err);
  } else {
    res.send('Success!');
  }
}

var _bots = {};
function trackBot(bot) {
  _bots[bot.config.token] = bot;
}

controller.on('create_bot',function(bot,config) {
  if (_bots[bot.config.token]) {
    // already online! do nothing.
  } else {
    bot.startRTM(function(err) {

      if (!err) {
        trackBot(bot);
      }

      bot.startPrivateConversation({user: config.createdBy},function(err,convo) {
        if (err) {
          console.log(err);
        } else {
          convo.say('I am a bot that has just joined your team');
          convo.say('You must now /invite me to a channel so that I can be of use!');
        }
      });

    });
  }
});

controller.storage.teams.all(function(err,teams) {
  if (err) {
    throw new Error(err);
  }

  // connect all teams with bots up to slack!
  for (var t  in teams) {
    if (teams[t].bot) {
      controller.spawn(teams[t]).startRTM(function(err, bot) {
        if (err) {
          console.log('Error connecting bot to Slack:',err);
        } else {
          trackBot(bot);
        }
      });
    }
  }
});


module.exports = controller;

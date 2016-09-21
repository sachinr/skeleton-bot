controller = require('./controller');

controller.on('rtm_open',function(bot) {
  console.log('** The RTM api just connected!');
});

controller.on('rtm_close',function(bot) {
  console.log('** The RTM api just closed');
  // you may want to attempt to re-open
});

controller.on('interactive_message_callback', function(bot, message) {
  if(message.actions[0]){
  }
});

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face',
  }, function(err, res) {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction :(', err);
    }
  });

  bot.startConversation(message, interactiveReplies);
  bot.api.files.upload({content: JSON.stringify(message), channels: message.channel});
});

function interactiveReplies(err, convo) {
  convo.ask({
    attachments:[
      {
        title: 'Do you want to proceed?',
        callback_id: '123',
        attachment_type: 'default',
        actions: [
          {
            "name":"yes",
            "text": "Yes",
            "value": "yes",
            "type": "button",
          },
          {
            "name":"no",
            "text": "No",
            "value": "no",
            "type": "button",
          }
        ]
      }
    ]
  },[
    {
      pattern: "yes",
      callback: function(reply, convo) {
        convo.say('FABULOUS!');
        convo.next();
        // do something awesome here.
      }
    },
    {
      pattern: "no",
      callback: function(reply, convo) {
        convo.say('Too bad');
        convo.next();
      }
    },
    {
      default: true,
        callback: function(reply, convo) {
          // do nothing
        }
    }
  ]);
}


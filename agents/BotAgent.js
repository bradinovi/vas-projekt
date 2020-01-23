var eve = require('evejs');
var schedule = require('node-schedule');
const config = require('../config.json')
const Telegraf = require('telegraf')
const bottoken = config.BotAgent.token;
const bot = new Telegraf(bottoken)
const Telegram = require('telegraf/telegram')
const telegram = new Telegram(bottoken, {
  agent: null,
  webhookReply: true
})

var fs = require('fs');
let rawdata = fs.readFileSync('USERS.json');
let USERS = JSON.parse(rawdata);
process.on('SIGINT', function () {
  console.log("Caught interrupt signal");
  console.log(USERS);
  fs.writeFile('USERS.json', JSON.stringify(USERS), 'utf8', () => {
    process.exit();
  });
});

console.log("My url:" + config.BotAgent.confURL)


eve.system.init({
  transports: [{
    type: 'ws',
    url: config.BotAgent.confURL,
    localShortcut: true,
  }]
});

const registerUser = (id) => {
  const key = "ID" + id.toString();
  if (!(key in USERS)) {
    USERS[key] = {
      location: {
        lat: 46.305744,
        lon: 16.336607
      }
    }
  }
  console.log("User registered");
}

const onStart = (ctx) => {
  registerUser(ctx.chat.id);
  ctx.reply('Welcome!')
}
const onRegister = (ctx) => {
  registerUser(ctx.chat.id);
  ctx.reply('Registered');
}
const onHelp = (ctx) => ctx.reply('Send me a sticker');

const onSticker = (ctx) => ctx.reply('👍');

const onHi = (ctx) => ctx.reply('Hey there');

const onLocation = (ctx) => {
  registerUser(ctx.chat.id);
  console.log(ctx.update.message.location)
  USERS["ID" + ctx.chat.id] = {
    location: {
      lat: ctx.update.message.location.latitude,
      lon: ctx.update.message.location.longitude
    }
  }
  ctx.reply('Your location has been updated.')
};

const onWeather = (ctx) => {
  registerUser(ctx.chat.id);
  var data = {
    lat: USERS["ID" + ctx.chat.id].location.lat,
    lon: USERS["ID" + ctx.chat.id].location.lon
  }
  agent.request(config.WeatherAgent.URL, { type: 'bot-get weather', data: data }).then(function (reply) {
    console.log(reply)
    ctx.reply(
      constructWeatherString(reply))
  });
}

const constructWeatherString = (data) => {
  return `${config.wEmoji[data.title]} \n${data.name} \n${data.temp} °C \n${data.desc}`
}

const onNews = (ctx) => {
  registerUser(ctx.chat.id);
  console.log(config.TrendsAgent.URL);
  agent.request(config.TrendsAgent.URL, { type: 'bot-get trends' }).then(function (reply) {
    reply.forEach(article => {
      agent.request(config.NewsAgent.URL, { type: 'bot-get news', query: article }).then(function (reply) {
        console.log('reply: ' + reply[0]);
        ctx.reply(reply[0].headline + " " + reply[0].url);
      });
    });
  });
};


function setBotEvents() {
  bot.start(onStart)
  bot.help(onHelp)
  bot.on('sticker', onSticker)
  bot.hears('register', onRegister)
  bot.hears('hi', onHi)
  bot.hears(config.newsTriggers, onNews)
  bot.hears(config.weatherTriggers, onWeather)
  bot.on('location', onLocation)
}

// BotAgent START
function BotAgent(id) {
  eve.Agent.call(this, id);
  this.extend('request');
  this.connect(eve.system.transports.getAll());
}

BotAgent.prototype = Object.create(eve.Agent.prototype);
BotAgent.prototype.constructor = BotAgent;

BotAgent.prototype.receive = function (posiljatelj, poruka) {
  console.log(posiljatelj + ': ' + JSON.stringify(poruka));
};

BotAgent.prototype.initBot = function () {
  setBotEvents();
  bot.launch()
};
// BotAgent END

var agent = new BotAgent('botAgent');
agent.initBot();


var newsJob = schedule.scheduleJob({ hour: 9, minute: 0 }, function () {
  Object.keys(USERS).forEach(userID => {
    var chatID = userID.substring(2, userID.length);
    agent.request(config.TrendsAgent.URL, { type: 'bot-get trends' }).then(function (reply) {
      reply.forEach(article => {
        agent.request(config.NewsAgent.URL, { type: 'bot-get news', query: article }).then(function (reply) {
          console.log('reply: ' + reply[0]);
          telegram.sendMessage(chatID, reply[0].headline + " " + reply[0].url);
        });
      });
    });
  });
});

var weatherJob = schedule.scheduleJob({ hour: 8, minute: 0 }, function () {
  Object.keys(USERS).forEach(userID => {
    var chatID = userID.substring(2, userID.length);
    var data = {
      lat: USERS[userID].location.lat,
      lon: USERS[userID].location.lon
    }
    agent.request(config.WeatherAgent.URL, { type: 'bot-get weather', data: data }).then(function (reply) {
      console.log(reply)
      telegram.sendMessage(
        constructWeatherString(reply)
      )
    });
  })
});
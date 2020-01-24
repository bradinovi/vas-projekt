const eve = require('evejs');
const schedule = require('node-schedule');
const config = require('../config.json')
const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const bot = new Telegraf(config.BotAgent.token)
const fs = require('fs');
const telegram = new Telegram(config.BotAgent.token, {
  agent: null,
  webhookReply: true
})


let rawdata = fs.readFileSync('../USERS.json');
let USERS = JSON.parse(rawdata);
process.on('SIGINT', function () {
  console.log("Exiting...");
  console.log(USERS);
  fs.writeFile('../USERS.json', JSON.stringify(USERS), 'utf8', () => {
    process.exit();
  });
});


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

const onSticker = (ctx) => ctx.reply('☺️');

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

const constructWeatherString = (data) => {
  return `${config.wEmoji[data.title]} \n${data.name} \n${data.temp} °C \n${data.desc}`
}

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

const onNews = (ctx) => {
  registerUser(ctx.chat.id);
  console.log(config.TrendsAgent.URL);
  agent.request(config.TrendsAgent.URL, { type: 'bot-get trends' }).then(function (reply) {
    reply.forEach(trend => {
      agent.request(config.NewsAgent.URL, { type: 'bot-get news', query: trend }).then(function (reply) {
        console.log('reply: ' + reply[0]);
        ctx.reply(reply[0].headline + " " + reply[0].url);
      });
    });
  });
};

const onTrends = (ctx) => {
  registerUser(ctx.chat.id);
  console.log(config.TrendsAgent.URL);
  agent.request(config.TrendsAgent.URL, { type: 'bot-get trends' }).then(function (reply) {
    let message = '📈 Trending now \n\n'
    reply.forEach(trend => {
      message += `➡️  ${trend} \n`
    });
    ctx.reply(message);
  });
};

const setBotEvents = () => {
  bot.on('sticker', onSticker)
  bot.hears('register', onRegister)
  bot.on('location', onLocation)
  bot.hears('hi', onHi)
  bot.start(onStart)
  bot.help(onHelp)
  bot.hears(config.newsTriggers, onNews)
  bot.hears(config.weatherTriggers, onWeather)
  bot.hears(config.trendsTriggers, onTrends)
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
console.log("My url:" + config.BotAgent.URL)

const newsJob = schedule.scheduleJob({ hour: 9, minute: 0 }, function () {
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

const weatherJob = schedule.scheduleJob({ hour: 8, minute: 0 }, function () {
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
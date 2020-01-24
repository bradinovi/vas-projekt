const eve = require('evejs');
const config = require('../config.json')
const news = require('../API/nyt-api')


eve.system.init({
  transports: [{
    type: 'ws',
    url: config.NewsAgent.confURL,
    localShortcut: true,
  }]
});


function NewsAgent(id) {
  eve.Agent.call(this, id);
  this.extend('request');
  this.connect(eve.system.transports.getAll());
}

NewsAgent.prototype = Object.create(eve.Agent.prototype);
NewsAgent.prototype.constructor = NewsAgent;

NewsAgent.prototype.receive = function (posiljatelj, poruka) {
  console.log(poruka);
  if (poruka.type == "bot-get news") {
    return getNews(poruka.query);
  }
};


var agent1 = new NewsAgent('newsAgent');
console.log("My url:" + config.NewsAgent.URL)

var getNews = async (query) => {
  var newsData = await news.getNews(query)
  return newsData;
}
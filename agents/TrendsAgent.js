const eve = require('evejs');
const config = require('../config.json')
const trends = require('../API/trends')

eve.system.init({
  transports: [{
    type: 'ws',
    url: config.TrendsAgent.confURL,
    localShortcut: true,
  }]
});

function TrendsAgent(id) {
  eve.Agent.call(this, id);
  this.extend('request');
  this.connect(eve.system.transports.getAll());
}

TrendsAgent.prototype = Object.create(eve.Agent.prototype);
TrendsAgent.prototype.constructor = TrendsAgent;

TrendsAgent.prototype.receive = function (posiljatelj, poruka) {
  console.log(poruka);
  if (poruka.type == "bot-get trends") {
    return getTrends();
  }
};

var agent1 = new TrendsAgent('trendsAgent');
console.log("My url:" + config.TrendsAgent.URL)

var getTrends = async () => {
  var trendsData = await trends.getGoogleTrends()
  console.log(trendsData)
  return trendsData;
}
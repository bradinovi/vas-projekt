var eve = require('evejs');
const config = require('../config.json')

console.log("My url:" + config.confUrlTrendsAgent)

eve.system.init({
  transports: [{
    type: 'ws',
    url: config.TrendsAgent.confURL,
    localShortcut: true,
  }]
});


function WeatherAgent(id) {
  eve.Agent.call(this, id);
  this.connect(eve.system.transports.getAll());
}

WeatherAgent.prototype = Object.create(eve.Agent.prototype);
WeatherAgent.prototype.constructor = WeatherAgent;

WeatherAgent.prototype.sendToNewsAgent = function () {
  this.send(config.urlNewsAgent, "Bok News agent");
};

var agent1 = new WeatherAgent('weatherAgent');
agent1.sendToNewsAgent();
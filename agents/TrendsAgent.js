var eve = require('evejs');
const config = require('../config.json')

console.log("My url:" + config.confUrlTrendsAgent)

eve.system.init({
  transports: [{
    type: 'ws',
    url: config.confUrlTrendsAgent,
    localShortcut: true,
  }]
});


function TrendsAgent(id) {
  eve.Agent.call(this, id);
  this.connect(eve.system.transports.getAll());
}

TrendsAgent.prototype = Object.create(eve.Agent.prototype);
TrendsAgent.prototype.constructor = TrendsAgent;

TrendsAgent.prototype.pozdrav = function (primatelj) {
  this.send(primatelj, 'Bok ' + primatelj + '!');
};

TrendsAgent.prototype.posalji = function (primatelj, poruka) {
  this.send(primatelj, poruka);
};

TrendsAgent.prototype.sendToNewsAgent = function () {
  this.send(config.urlNewsAgent, "Bok News agent");
};


var agent1 = new TrendsAgent('trendsAgent');
agent1.sendToNewsAgent();
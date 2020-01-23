var eve = require('evejs');
const config = require('../config.json')

console.log("My url:" + config.confUrlNewsAgent)
eve.system.init({
  transports: [{
    type: 'ws',
    url: config.confUrlNewsAgent,
    localShortcut: true,
  }]
});


function NewsAgent(id) {
  eve.Agent.call(this, id);
  this.connect(eve.system.transports.getAll());
}

NewsAgent.prototype = Object.create(eve.Agent.prototype);
NewsAgent.prototype.constructor = NewsAgent;

NewsAgent.prototype.pozdrav = function (primatelj) {
  this.send(primatelj, 'Bok ' + primatelj + '!');
};

NewsAgent.prototype.posalji = function (primatelj, poruka) {
  this.send(primatelj, poruka);
};

NewsAgent.prototype.receive = function (posiljatelj, poruka) {
  console.log(posiljatelj + ': ' + JSON.stringify(poruka));
};


var agent1 = new NewsAgent('newsAgent');
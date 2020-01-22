var eve = require('evejs');

function Agent(id) {
  eve.Agent.call(this, id);
  this.connect(eve.system.transports.getAll());
}

Agent.prototype = Object.create(eve.Agent.prototype);
Agent.prototype.constructor = Agent;

Agent.prototype.pozdrav = function (primatelj) {
  this.send(primatelj, 'Bok ' + primatelj + '!');
};

Agent.prototype.posalji = function (primatelj, poruka) {
  this.send(primatelj, poruka);
};

Agent.prototype.receive = function (posiljatelj, poruka) {
  console.log(posiljatelj + ': ' + JSON.stringify(poruka));
};

module.exports = Agent;

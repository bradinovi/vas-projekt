var eve = require('evejs');
var urlAgenta = 'ws://127.0.0.1:3000/agents/:id';

eve.system.init({
    transports: [{
        type: 'ws',
        url: urlAgenta,
        localShortcut: true,
    }]
});

var Agent = require('./AgentModul');

var agent1 = new Agent('agent1');

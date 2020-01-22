const eve = require('evejs');
const urlAgenta = 'ws://127.0.0.1:3001/agents/:id';

eve.system.init({
    transports: [{
        type: 'ws',
        url: urlAgenta,
        localShortcut: true,
    }]
});

var Agent = require('./AgentModul');

var agent2 = new Agent('agent2');

agent2.pozdrav('ws://127.0.0.1:3000/agents/agent1');

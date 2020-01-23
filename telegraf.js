const Telegraf = require('telegraf')
const bottoken = "655250735:AAHuwk7fH44FNzfliZZ2S0bVIeZ_JO1A6y4"
const bot = new Telegraf(bottoken)
const Telegram = require('telegraf/telegram')
const telegram = new Telegram(bottoken, {
    agent: null,
    webhookReply: true
})
let users = [];

bot.start((ctx) => {
    users.push(ctx.chat.id);
    ctx.reply('Welcome!')
})
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('register', (ctx) => {
    users.push(ctx.chat.id);
    console.log("registerd")
    ctx.reply('Registered')
})
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.on('location', (ctx) => {
    console.log(ctx.update.message.location)
    ctx.reply('poslali ste lokaciju')
})
bot.launch()


function intervalFunc() {
    users.forEach(id => {
        console.log(id)
        telegram.sendMessage(id, "Ping");
    });
    console.log('Cant stop me now!');
}

//setInterval(intervalFunc, 5000);

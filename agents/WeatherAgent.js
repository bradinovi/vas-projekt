var eve = require('evejs');
const config = require('../config.json')
const weather = require('../API/owm')

console.log("My url:" + config.WeatherAgent.confURL)

eve.system.init({
  transports: [{
    type: 'ws',
    url: config.WeatherAgent.confURL,
    localShortcut: true,
  }]
});


function WeatherAgent(id) {
  eve.Agent.call(this, id);
  this.extend('request');
  this.connect(eve.system.transports.getAll());
}

WeatherAgent.prototype = Object.create(eve.Agent.prototype);
WeatherAgent.prototype.constructor = WeatherAgent;

WeatherAgent.prototype.receive = function (posiljatelj, poruka) {
  console.log(poruka);
  if (poruka.type == "bot-get weather") {
    console.log(poruka)
    return getWeather(poruka.data.lat, poruka.data.lon);
  }
};

var agent = new WeatherAgent('weatherAgent');

var getWeather = async (lat, lon) => {
  let weatherData = await weather.getWeatherForLocation(
    lat,
    lon,
  )
  console.log(weatherData)
  return weatherData;
}
const https = require('https')
const url = require('url');
const APPID = "8e79f2138ed57b7c248b7a0e4af1b020";

const getWeatherForLocation = (lat, lon) => {
    return new Promise((resolve, reject) => {
        const requestUrl = url.parse(url.format({
            protocol: 'https',
            hostname: 'api.openweathermap.org',
            pathname: '/data/2.5/weather',
            query: {
                lat: lat,
                lon: lon,
                APPID: APPID,
                units: 'metric'
            }
        }));

        const req = https.get({
            hostname: requestUrl.hostname,
            path: requestUrl.path,
        }, (res) => {
            let body = "";
            res.on("data", data => {
                body += data;
            });
            let articleData = [];
            res.on("end", () => {
                body = JSON.parse(body);
                body = Object.assign({}, body);
                //console.log(body)

                let weatherData = {
                    title: body.weather[0].main,
                    desc: body.weather[0].description,
                    temp: body.main.temp,
                    temp_min: body.main.temp_min,
                    temp_max: body.main.temp_max,
                    feels_like: body.main.feels_like,
                    icon: 'http://openweathermap.org/img/wn/' + body.weather[0].icon + '.png',
                    name: body.name
                }
                //sconsole.log(weatherData)
                resolve(weatherData);
            })

        })
    })
};

exports.getWeatherForLocation = getWeatherForLocation;

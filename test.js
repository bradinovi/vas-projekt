const nyt = require('./API/nyt-api')
const trends = require('./API/trends')
const owm = require('./API/owm')

const config = require('./config.json')
/*
nyt.getNews("NFL Draft 2020").then((data) => {
    console.log(data);
})

trends.getGoogleTrends().then(
    (data) => {
        console.log(data);
    }
)

owm.getWeatherForLocation(35, 139).then(
    data => console.log(data)
)*/

console.log(config)